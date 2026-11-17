(() => {
  'use strict';

  const { LINKS, CHANNELS, COFFEE_CHANNEL, PROJECTS, OSS, FORKS, MENU, MENU_EXTRAS, I18N, COMMANDS } = window.PORTFOLIO;

  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => [...el.querySelectorAll(sel)];
  const clamp = (n, min, max) => Math.min(max, Math.max(min, n));
  const pad = (n) => String(n).padStart(2, '0');
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const normalize = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim();
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const store = {
    get(key, fallback) {
      try { const v = localStorage.getItem(key); return v === null ? fallback : JSON.parse(v); } catch { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sem storage, sem problema */ }
    },
  };

  const browserLang = (navigator.language || 'pt').toLowerCase().startsWith('pt') ? 'pt' : 'en';
  const state = {
    lang: store.get('lang', browserLang),
    channel: clamp(Number(store.get('channel', 1)) || 0, 0, CHANNELS.length - 1),
    muted: store.get('muted', false),
    volume: clamp(Number(store.get('volume', 5)) || 0, 0, 10),
    power: true,
    route: '/',
  };
  if (!I18N[state.lang]) state.lang = 'pt';

  let audioUnlocked = false;
  const audible = () => audioUnlocked && !state.muted && state.volume > 0;

  const t = (key) => key.split('.').reduce((o, k) => (o == null ? o : o[k]), I18N[state.lang]) ?? key;
  const L = (obj) => (obj && typeof obj === 'object' ? obj[state.lang] ?? obj.pt : obj);

  const els = {
    screen: $('#screen-inner'),
    content: $('#content'),
    tvContent: $('#tv-content'),
    textNav: $('#text-nav'),
    chLabel: $('#ch-label'),
    chName: $('#ch-name'),
    date: $('#date'),
    cups: $('#cups'),
    osdChannel: $('#osd-channel'),
    osdVolume: $('#osd-volume'),
    osdSignal: $('#osd-signal'),
    soundBtn: $('#sound-btn'),
  };

  /* -------------------------------------------------------
     OSD (on-screen display)
     ------------------------------------------------------- */
  const osdTimers = new Map();
  function flash(el, html, ms = 2400) {
    el.innerHTML = html;
    el.classList.add('is-visible');
    clearTimeout(osdTimers.get(el));
    if (ms) osdTimers.set(el, setTimeout(() => el.classList.remove('is-visible'), ms));
  }

  function showChannelOSD() {
    const ch = CHANNELS[state.channel];
    flash(els.osdChannel, `CH ${pad(state.channel)}<small>${esc(L(ch.name))}</small>`);
  }

  function showVolumeOSD() {
    if (state.muted || state.volume === 0) {
      flash(els.osdVolume, `${t('mute')} 🔇`);
      return;
    }
    const bars = '▮'.repeat(state.volume) + '▯'.repeat(10 - state.volume);
    flash(els.osdVolume, `${t('volume')} <span class="bars">${bars}</span>`);
  }

  /* -------------------------------------------------------
     Estática (canvas) — alguns quadros pré-gerados em loop
     ------------------------------------------------------- */
  const Static = (() => {
    const canvas = $('#static');
    const ctx = canvas.getContext('2d');
    let frames = [];
    let i = 0;
    let last = 0;

    function build() {
      const w = Math.max(160, Math.ceil(innerWidth / 3));
      const h = Math.max(90, Math.ceil(innerHeight / 3));
      canvas.width = w;
      canvas.height = h;
      frames = [];
      for (let f = 0; f < 6; f++) {
        const img = ctx.createImageData(w, h);
        const buf = new Uint32Array(img.data.buffer);
        for (let y = 0; y < h; y++) {
          // faixas horizontais mais claras/escuras dão cara de sinal analógico
          const band = Math.random() < 0.04 ? 60 : 0;
          for (let x = 0; x < w; x++) {
            const v = clamp(((Math.random() * 255) | 0) + band, 0, 255);
            buf[y * w + x] = 0xff000000 | (v << 16) | (v << 8) | v;
          }
        }
        frames.push(img);
      }
    }

    function loop(now) {
      requestAnimationFrame(loop);
      if (now - last < 45) return;
      last = now;
      i = (i + 1 + ((Math.random() * 3) | 0)) % frames.length;
      ctx.putImageData(frames[i], 0, (Math.random() * 6) | 0);
    }

    function start() {
      build();
      ctx.putImageData(frames[0], 0, 0);
      if (!reduceMotion) requestAnimationFrame(loop);
      let resizeTimer;
      addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(build, 200);
      });
    }

    return { start };
  })();

  /* -------------------------------------------------------
     Som: chiado da troca de canal + "mar" de ruído branco no CH 00
     ------------------------------------------------------- */
  const Sound = (() => {
    let ctx;
    let noise;
    let sea = null;

    function ensure() {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return false;
      if (!ctx) {
        ctx = new AC();
        const len = ctx.sampleRate * 2;
        noise = ctx.createBuffer(1, len, ctx.sampleRate);
        const data = noise.getChannelData(0);
        for (let n = 0; n < len; n++) data[n] = Math.random() * 2 - 1;
      }
      if (ctx.state === 'suspended') ctx.resume();
      return true;
    }

    const level = () => (audible() ? state.volume / 10 : 0);

    function burst(ms = 320) {
      if (!level() || !ensure()) return;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      const g = ctx.createGain();
      g.gain.value = 0.05 * level();
      src.connect(g).connect(ctx.destination);
      src.start();
      src.stop(ctx.currentTime + ms / 1000);
    }

    // ruído branco filtrado + LFO lento = ondas quebrando
    function setSea(on) {
      if (sea) {
        try { sea.src.stop(); sea.lfo.stop(); } catch { /* já parado */ }
        sea = null;
      }
      if (!on || !level() || !ensure()) return;
      const src = ctx.createBufferSource();
      src.buffer = noise;
      src.loop = true;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.value = 900;
      const gain = ctx.createGain();
      const base = 0.12 * level();
      gain.gain.value = base;
      const lfo = ctx.createOscillator();
      lfo.frequency.value = 0.11;
      const lfoGain = ctx.createGain();
      lfoGain.gain.value = base * 0.85;
      lfo.connect(lfoGain).connect(gain.gain);
      src.connect(filter).connect(gain).connect(ctx.destination);
      src.start();
      lfo.start();
      sea = { src, lfo };
    }

    return { burst, setSea };
  })();

  /* -------------------------------------------------------
     TV: canais do YouTube
     ------------------------------------------------------- */
  const TV = (() => {
    let player = null;
    let ready = false;
    let failsafe;

    const screen = els.screen;
    const isWhiteNoise = () => !CHANNELS[state.channel].id;

    function loadAPI() {
      window.onYouTubeIframeAPIReady = () => {
        const vars = {
          autoplay: 1, mute: 1, controls: 0, disablekb: 1, fs: 0,
          iv_load_policy: 3, modestbranding: 1, playsinline: 1, rel: 0, cc_load_policy: 0,
        };
        if (/^https?:/.test(location.protocol)) vars.origin = location.origin;
        player = new YT.Player('yt-player', {
          host: 'https://www.youtube-nocookie.com',
          width: '100%',
          height: '100%',
          playerVars: vars,
          events: {
            onReady: () => {
              ready = true;
              const frame = player.getIframe();
              frame.setAttribute('tabindex', '-1');
              frame.setAttribute('title', 'TV');
              if (state.power && !isWhiteNoise()) load(CHANNELS[state.channel]);
            },
            onStateChange: (e) => {
              if (e.data === YT.PlayerState.PLAYING) reveal();
              if (e.data === YT.PlayerState.ENDED) { player.seekTo(0); player.playVideo(); }
            },
            onError: noSignal,
          },
        });
      };
      const s = document.createElement('script');
      s.src = 'https://www.youtube.com/iframe_api';
      s.async = true;
      s.onerror = noSignal;
      document.head.appendChild(s);
    }

    function load(ch) {
      const startSeconds = ch.maxStart ? Math.floor(Math.random() * ch.maxStart) : 0;
      player.loadVideoById({ videoId: ch.id, startSeconds });
      applyVolume();
    }

    function reveal() {
      if (isWhiteNoise() || !state.power) return;
      clearTimeout(failsafe);
      screen.classList.remove('no-signal');
      els.osdSignal.classList.remove('is-visible');
      setTimeout(() => {
        screen.classList.remove('is-switching');
        screen.classList.add('has-video');
      }, 250);
    }

    function noSignal() {
      if (isWhiteNoise()) return;
      clearTimeout(failsafe);
      screen.classList.remove('is-switching', 'has-video');
      screen.classList.add('no-signal');
      flash(els.osdSignal, location.protocol === 'file:' ? t('fileProtocol') : t('noSignal'), 0);
    }

    function tune(n, { silent = false } = {}) {
      const total = CHANNELS.length;
      state.channel = ((n % total) + total) % total;
      store.set('channel', state.channel);
      updateChannelLabels();
      if (!state.power) return;

      const ch = CHANNELS[state.channel];
      screen.classList.add('is-switching');
      screen.classList.remove('no-signal');
      els.osdSignal.classList.remove('is-visible');
      if (!silent) Sound.burst();
      showChannelOSD();
      clearTimeout(failsafe);

      if (!ch.id) {
        screen.classList.remove('has-video');
        screen.classList.add('is-white-noise');
        if (ready) player.pauseVideo();
        Sound.setSea(true);
        failsafe = setTimeout(() => screen.classList.remove('is-switching'), 350);
        return;
      }

      screen.classList.remove('is-white-noise');
      Sound.setSea(false);
      if (ready) load(ch);
      // se o vídeo não carregar em alguns segundos, mostra "sem sinal"
      failsafe = setTimeout(noSignal, 9000);
    }

    function applyVolume() {
      if (!ready) return;
      if (!audible()) player.mute();
      else { player.unMute(); player.setVolume(state.volume * 10); }
    }

    function setPower(on) {
      if (!on) {
        clearTimeout(failsafe);
        if (ready) player.pauseVideo();
        Sound.setSea(false);
        screen.classList.remove('is-switching');
      } else {
        // reinicia a animação de ligar
        screen.style.animation = 'none';
        void screen.offsetHeight;
        screen.style.animation = '';
        tune(state.channel, { silent: true });
      }
    }

    function soundChanged() {
      applyVolume();
      Sound.setSea(state.power && isWhiteNoise());
      showVolumeOSD();
      updateSoundBtn();
    }

    return { loadAPI, tune, setPower, soundChanged };
  })();

  /* -------------------------------------------------------
     Controles
     ------------------------------------------------------- */
  function changeVolume(delta) {
    if (state.muted && delta > 0) {
      state.muted = false;
      state.volume = Math.max(state.volume, 1);
    } else {
      state.volume = clamp(state.volume + delta, 0, 10);
      state.muted = state.volume === 0;
    }
    store.set('muted', state.muted);
    store.set('volume', state.volume);
    TV.soundChanged();
  }

  function toggleMute() {
    state.muted = !state.muted;
    if (!state.muted && state.volume === 0) state.volume = 5;
    store.set('muted', state.muted);
    store.set('volume', state.volume);
    TV.soundChanged();
  }

  function togglePower(on = !state.power) {
    state.power = on;
    document.body.dataset.power = on ? 'on' : 'off';
    TV.setPower(on);
  }

  function updateSoundBtn() {
    const on = !state.muted && state.volume > 0;
    els.soundBtn.textContent = I18N[state.lang].sound(on);
    els.soundBtn.setAttribute('aria-pressed', String(on));
    els.soundBtn.setAttribute('aria-label', t('soundLabel'));
  }

  function updateChannelLabels() {
    els.chLabel.textContent = `CH ${pad(state.channel)}`;
    els.chName.textContent = L(CHANNELS[state.channel].name);
  }

  function updateDate() {
    els.date.textContent = new Intl.DateTimeFormat(t('dateLocale'), { day: '2-digit', month: 'short', year: 'numeric' })
      .format(new Date())
      .replace(/\./g, '')
      .toUpperCase();
    // um café a cada ~3h desde as 6 da manhã. Ciência.
    const h = new Date().getHours();
    const cups = h < 6 ? 0 : clamp(Math.floor((h - 6) / 3) + 1, 1, 6);
    els.cups.textContent = I18N[state.lang].cups(cups);
    els.cups.title = t('cupsTitle');
  }

  /* -------------------------------------------------------
     Páginas
     ------------------------------------------------------- */
  const link = (href, label, cls = '') =>
    `<a${cls ? ` class="${cls}"` : ''} href="${esc(href)}" target="_blank" rel="noopener noreferrer">${esc(label)}</a>`;

  function guideItem(p, slot) {
    const meta = [p.lang, p.stars ? `★${p.stars}` : null].filter(Boolean).join(' · ');
    const links = [
      p.demo ? link(p.demo, t('projects.demo')) : '',
      link(p.url, t('projects.code')),
    ].join('');
    return `
      <li class="guide__item">
        <span class="guide__slot">${esc(slot)}</span>
        <div>
          <div class="guide__head">
            ${link(p.url, p.name, 'guide__name')}
            <span class="guide__meta">${esc(meta)}</span>
            ${p.badge ? `<span class="guide__badge">${esc(L(p.badge))}</span>` : ''}
          </div>
          <p class="guide__desc">${esc(L(p.desc))}</p>
          <p class="guide__links">${links}</p>
        </div>
      </li>`;
  }

  const PAGES = {
    '/': {
      label: 'nav.home',
      render: () => `<article class="bio"><p class="big-text">${t('bio')}</p></article>`,
    },
    '/projects': {
      label: 'nav.projects',
      render: () => `
        <h1 class="page-title">${esc(t('projects.title'))}</h1>
        <p class="page-lead">${esc(t('projects.lead'))}</p>
        <ol class="guide">${PROJECTS.map((p) => guideItem(p, String(p.year))).join('')}</ol>`,
    },
    '/open-source': {
      label: 'nav.oss',
      render: () => `
        <h1 class="page-title">${esc(t('oss.title'))}</h1>
        <p class="page-lead">${esc(t('oss.lead'))}</p>
        <ol class="guide">${OSS.map((p, i) => guideItem(p, `CH${pad(i + 1)}`)).join('')}</ol>
        <h2 class="section-title">${esc(t('oss.forksTitle'))}</h2>
        <p class="page-lead">${esc(t('oss.forksLead'))}</p>
        <ul class="forks">${FORKS.map((f) => `<li>${link(f.url, f.name)}</li>`).join('')}</ul>`,
    },
    '/menu': {
      label: 'nav.menu',
      render: () => `
        <h1 class="page-title">${esc(t('menu.title'))}</h1>
        <p class="page-lead">${esc(t('menu.lead'))}</p>
        <div class="menu-board">
          ${MENU.map((m) => `
            <div class="menu-board__row">
              <div class="menu-board__line">
                <span class="menu-board__drink">${esc(L(m.drink))}</span>
                <span class="menu-board__dots" aria-hidden="true"></span>
                <span class="menu-board__price" aria-hidden="true">${m.price}</span>
              </div>
              <div class="menu-board__stack">${esc(m.stack)}</div>
              <div class="menu-board__note">${esc(L(m.note))}</div>
            </div>`).join('')}
        </div>
        <h2 class="section-title">${esc(t('menu.extras'))}</h2>
        <ul class="extras">${MENU_EXTRAS[state.lang].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>
        <p class="footnote">${esc(t('menu.footnote'))} <button class="link-btn" data-channel="${COFFEE_CHANNEL}">☕ CH ${pad(COFFEE_CHANNEL)}</button></p>`,
    },
  };

  const currentPath = () => {
    const path = location.hash.replace(/^#/, '') || '/';
    return PAGES[path] ? path : '/';
  };

  function render({ transition = true } = {}) {
    const path = currentPath();
    const changed = path !== state.route;
    state.route = path;
    els.content.innerHTML = PAGES[path].render();
    els.content.style.setProperty('--me-photo', `url("${LINKS.avatar}")`);
    els.textNav.textContent = t(PAGES[path].label);
    $$('.menu a').forEach((a) => {
      if (a.getAttribute('href') === `#${path}`) a.setAttribute('aria-current', 'page');
      else a.removeAttribute('aria-current');
    });
    document.title = path === '/' ? t('title') : `${t(PAGES[path].label)} · Iury Nogueira`;
    if (changed && transition) {
      els.tvContent.scrollTop = 0;
      if (!reduceMotion) {
        els.screen.classList.remove('is-glitching');
        void els.screen.offsetWidth;
        els.screen.classList.add('is-glitching');
        Sound.burst(120);
      }
    }
  }

  function applyLang() {
    document.documentElement.lang = t('htmlLang');
    $$('[data-i18n]').forEach((el) => { el.textContent = t(el.dataset.i18n); });
    $$('[data-i18n-aria]').forEach((el) => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
    updateSoundBtn();
    updateChannelLabels();
    updateDate();
    render({ transition: false });
  }

  function toggleLang() {
    state.lang = state.lang === 'pt' ? 'en' : 'pt';
    store.set('lang', state.lang);
    applyLang();
  }

  /* -------------------------------------------------------
     Navegação digitável (com busca aproximada)
     ------------------------------------------------------- */
  function levenshtein(a, b) {
    const dp = Array.from({ length: b.length + 1 }, (_, i) => i);
    for (let i = 1; i <= a.length; i++) {
      let prev = dp[0];
      dp[0] = i;
      for (let j = 1; j <= b.length; j++) {
        const tmp = dp[j];
        dp[j] = Math.min(dp[j] + 1, dp[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
        prev = tmp;
      }
    }
    return dp[b.length];
  }

  function findCommand(input) {
    const q = normalize(input);
    if (!q) return null;
    let best = null;
    let bestScore = Infinity;
    for (const cmd of COMMANDS) {
      for (const alias of cmd.aliases) {
        const a = normalize(alias);
        const bonus = a.startsWith(q) || q.startsWith(a) ? -3 : 0;
        const score = levenshtein(q, a) + bonus;
        if (score < bestScore) { bestScore = score; best = cmd; }
      }
    }
    return bestScore <= Math.max(2, Math.floor(q.length / 2)) ? best : null;
  }

  function runCommand(input) {
    const cmd = findCommand(input);
    if (!cmd) {
      els.textNav.classList.add('is-error');
      flash(els.osdSignal, t('notFound'), 1600);
      Sound.burst(200);
      setTimeout(() => {
        els.textNav.classList.remove('is-error');
        els.textNav.textContent = t(PAGES[state.route].label);
      }, 1200);
      return;
    }
    els.textNav.blur();
    if (cmd.go) {
      if (location.hash === cmd.go || (cmd.go === '#/' && currentPath() === '/')) render();
      else location.hash = cmd.go;
    } else if (cmd.url) {
      if (cmd.url.startsWith('mailto:')) location.href = cmd.url;
      else window.open(cmd.url, '_blank', 'noopener');
    } else if (cmd.action === 'coffee') TV.tune(COFFEE_CHANNEL);
    else if (cmd.action === 'beach') TV.tune(1 + Math.floor(Math.random() * (CHANNELS.length - 2)));
    else if (cmd.action === 'static') TV.tune(0);
    else if (cmd.action === 'power') togglePower(false);
    els.textNav.textContent = t(PAGES[currentPath()].label);
  }

  function setupTextNav() {
    const nav = els.textNav;
    nav.addEventListener('focus', () => {
      const range = document.createRange();
      range.selectNodeContents(nav);
      const sel = getSelection();
      sel.removeAllRanges();
      sel.addRange(range);
    });
    nav.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') { e.preventDefault(); runCommand(nav.textContent); }
      if (e.key === 'Escape') { nav.textContent = t(PAGES[state.route].label); nav.blur(); }
    });
    nav.addEventListener('blur', () => {
      if (!nav.textContent.trim()) nav.textContent = t(PAGES[state.route].label);
    });
    // sem colar HTML dentro do contenteditable
    nav.addEventListener('paste', (e) => {
      e.preventDefault();
      document.execCommand('insertText', false, (e.clipboardData || window.clipboardData).getData('text'));
    });
  }

  /* -------------------------------------------------------
     Eventos
     ------------------------------------------------------- */
  function onClick(e) {
    const ch = e.target.closest('[data-channel]');
    if (ch) {
      if (!state.power) togglePower(true);
      TV.tune(Number(ch.dataset.channel));
      return;
    }
    const btn = e.target.closest('[data-action]');
    if (!btn) return;
    const action = btn.dataset.action;
    if (action !== 'power' && action !== 'lang' && !state.power) togglePower(true);
    switch (action) {
      case 'next': TV.tune(state.channel + 1); break;
      case 'prev': TV.tune(state.channel - 1); break;
      case 'volup': changeVolume(1); break;
      case 'voldown': changeVolume(-1); break;
      case 'mute': toggleMute(); break;
      case 'power': togglePower(); break;
      case 'lang': toggleLang(); break;
      default: break;
    }
  }

  function onKey(e) {
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    const target = e.target;
    if (target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    const k = e.key;

    if (k === 'p' || k === 'P') { togglePower(); return; }
    if (!state.power) {
      if (k === 'Enter' || k === ' ') { e.preventDefault(); togglePower(true); }
      return;
    }
    if (/^[0-9]$/.test(k)) {
      const n = Number(k);
      if (n < CHANNELS.length) TV.tune(n);
    } else if (k === 'ArrowRight' || k === ']' || k === '.') { e.preventDefault(); TV.tune(state.channel + 1); }
    else if (k === 'ArrowLeft' || k === '[' || k === ',') { e.preventDefault(); TV.tune(state.channel - 1); }
    else if (k === '+' || k === '=') changeVolume(1);
    else if (k === '-' || k === '_') changeVolume(-1);
    else if (k === 'm' || k === 'M') toggleMute();
    else if (k === 'l' || k === 'L') toggleLang();
    else if (k === '/') { e.preventDefault(); els.textNav.focus(); }
  }

  function init() {
    document.addEventListener('click', onClick);
    document.addEventListener('keydown', onKey);
    addEventListener('hashchange', () => render());

    // skip link sem brigar com o roteamento por hash
    $('.skip-link').addEventListener('click', (e) => {
      e.preventDefault();
      els.content.focus();
    });

    setupTextNav();
    applyLang();
    Static.start();
    TV.tune(state.channel, { silent: true });
    TV.loadAPI();

    // o som já vem ligado; o navegador só libera o áudio no primeiro gesto do visitante
    const unlockEvents = ['pointerdown', 'keydown', 'touchstart'];
    const unlockAudio = () => {
      if (audioUnlocked) return;
      audioUnlocked = true;
      unlockEvents.forEach((ev) => removeEventListener(ev, unlockAudio, true));
      els.osdVolume.classList.remove('is-visible');
      if (!state.muted) TV.soundChanged();
    };
    unlockEvents.forEach((ev) => addEventListener(ev, unlockAudio, true));
    setTimeout(() => {
      if (!audioUnlocked && !state.muted) flash(els.osdVolume, t('soundHint'), 0);
    }, 2200);
    setInterval(updateDate, 60 * 1000);
  }

  init();
})();
