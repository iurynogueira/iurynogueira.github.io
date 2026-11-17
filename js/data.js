/*
 * Conteúdo do portfolio.
 * Quer trocar um vídeo? Edite CHANNELS: `id` é o ID do YouTube
 * (o que vem depois de watch?v=) e `maxStart` é até quantos segundos
 * o vídeo pode começar aleatoriamente (pra cada visita cair num trecho diferente).
 */
window.PORTFOLIO = (() => {
  const LINKS = {
    github: 'https://github.com/iurynogueira',
    linkedin: 'https://www.linkedin.com/in/iury-nogueira/',
    instagram: 'https://www.instagram.com/iurynogueiraa/',
    devto: 'https://dev.to/iurynogueira',
    email: 'mailto:nogueiraiury20@gmail.com',
    avatar: 'https://avatars.githubusercontent.com/u/6165180?v=4',
  };

  const CHANNELS = [
    { id: null, name: { pt: 'ruído branco', en: 'white noise' } },
    { id: 'NvIKkuCqRAY', maxStart: 30000, name: { pt: 'ondas do havaí', en: 'hawaii waves' } },
    { id: 'IChtXXu03fU', maxStart: 60, name: { pt: 'praia vista do alto', en: 'beach from above' } },
    { id: 'dwnpJ9jzTdA', maxStart: 5400, name: { pt: 'fim de tarde', en: 'golden hour' } },
    { id: 'ftK1yJXgDJY', maxStart: 60, name: { pt: 'lua na praia', en: 'moonlit beach' } },
    { id: 'rqSTGxGF1eU', maxStart: 25000, name: { pt: 'mar à noite', en: 'ocean at night' } },
    { id: 'hKIABJsnyo8', maxStart: 0, name: { pt: 'canal do barista', en: 'barista channel' } },
  ];

  const COFFEE_CHANNEL = CHANNELS.length - 1; // o café é sempre o último canal

  // Projetos pessoais — "grade de programação"
  const PROJECTS = [
    {
      name: 'recommendation-system', year: 2026, lang: 'JavaScript',
      url: 'https://github.com/iurynogueira/recommendation-system',
      desc: {
        pt: 'Recomendação de planos de telecom: perfis, produtos e histórico de compras rastreado, base pra um motor de recomendação com TensorFlow.js.',
        en: 'Telco plan recommendations: user profiles, products and tracked purchase history, groundwork for a TensorFlow.js recommendation engine.',
      },
    },
    {
      name: 'bot-discord', year: 2026, lang: 'Node.js',
      url: 'https://github.com/iurynogueira/bot-discord',
      desc: {
        pt: 'Bot de Discord que toca um áudio quando um membro específico entra na sala de voz. A zoeira também é engenharia.',
        en: 'Discord bot that plays an audio clip when a specific member joins a voice channel. Banter is engineering too.',
      },
    },
    {
      name: 'the_reef', year: 2025, lang: 'Rails · Angular · C++',
      badge: { pt: '🪸 meu aquário', en: '🪸 my reef tank' },
      url: 'https://github.com/espoo-dev/the_reef',
      demo: 'https://myreef.vercel.app',
      desc: {
        pt: 'Automação e monitoramento do meu aquário de recife de corais. Firmware em C++ num ESP8266 lendo sensores e acionando equipamentos, API em Rails (Postgres + Sidekiq) e painel web. Projeto aberto na espoo-dev, onde sou o maior contribuidor.',
        en: 'Automation and monitoring for my coral reef tank. C++ firmware on an ESP8266 reading sensors and driving equipment, a Rails API (Postgres + Sidekiq) and a web dashboard. Open-source under espoo-dev, where I am the top contributor.',
      },
    },
    {
      name: 'rpgzim', year: 2025, lang: 'JavaScript',
      url: 'https://github.com/iurynogueira/rpgzim',
      desc: {
        pt: 'Regras de um RPG modeladas em código: classes, atributos, armas e magias com restrições por classe.',
        en: 'RPG rules modeled in code: classes, attributes, weapons and spells with per-class restrictions.',
      },
    },
    {
      name: 'angular-clean', year: 2024, lang: 'Angular', stars: 7,
      url: 'https://github.com/iurynogueira/angular-clean',
      demo: 'https://angular-clean.vercel.app/',
      desc: {
        pt: 'Angular com clean architecture: camadas separadas, testes, CI no CircleCI e cobertura medida no Code Climate.',
        en: 'Angular with clean architecture: separated layers, tests, CircleCI and coverage tracked on Code Climate.',
      },
    },
    {
      name: 'jira-github-webhook', year: 2024, lang: 'Express', stars: 1,
      url: 'https://github.com/iurynogueira/jira-github-webhook',
      desc: {
        pt: 'Servidor Express que recebe eventos do GitHub e os leva pro Jira.',
        en: 'Express server that receives GitHub events and forwards them to Jira.',
      },
    },
    {
      name: 'coffee-recipe', year: 2023, lang: 'TypeScript',
      url: 'https://github.com/iurynogueira/coffee-recipe',
      demo: 'https://coffee-recipe-seven.vercel.app',
      desc: {
        pt: 'Um app de apoio pra quem ama café. Feito com Vite + TypeScript, testado com muita xícara.',
        en: 'A companion app for coffee lovers. Built with Vite + TypeScript, tested with plenty of cups.',
      },
    },
    {
      name: 'microfrontend', year: 2023, lang: 'HTML',
      url: 'https://github.com/iurynogueira/microfrontend',
      desc: {
        pt: 'Aplicação com microfrontends pra praticar a arquitetura.',
        en: 'An app split into microfrontends to practice the architecture.',
      },
    },
    {
      name: 'adios-webpack', year: 2023, lang: 'Rollup',
      url: 'https://github.com/iurynogueira/adios-webpack',
      desc: {
        pt: 'Estrutura de UI Kit empacotada com Rollup. Adiós, webpack.',
        en: 'A UI Kit structure bundled with Rollup. Adiós, webpack.',
      },
    },
    {
      name: 'go-websocket', year: 2023, lang: 'Go',
      url: 'https://github.com/iurynogueira/go-websocket',
      desc: {
        pt: 'Boilerplate de WebSocket com Go no back e JS no front.',
        en: 'WebSocket boilerplate with Go on the back and JS on the front.',
      },
    },
    {
      name: 'collect-coverage', year: 2023, lang: 'Bun',
      url: 'https://github.com/iurynogueira/collect-coverage',
      desc: {
        pt: 'Mini projeto pra aprender Bun.',
        en: 'Tiny project to learn Bun.',
      },
    },
    {
      name: 'clean-react', year: 2021, lang: 'React',
      url: 'https://github.com/iurynogueira/clean-react',
      desc: {
        pt: 'Estrutura de clean architecture pra projetos React.',
        en: 'Clean architecture structure for React projects.',
      },
    },
    {
      name: 'github-overview-mobile', year: 2020, lang: 'React Native',
      url: 'https://github.com/iurynogueira/github-overview-mobile',
      desc: {
        pt: 'App em React Native que consome a API do GitHub pra mostrar usuários e repositórios favoritos.',
        en: 'React Native app that uses the GitHub API to show users and their favorite repositories.',
      },
    },
    {
      name: 'reef', year: 2020, lang: 'HTML',
      url: 'https://github.com/iurynogueira/reef',
      desc: {
        pt: 'Automação de aquário marinho (reef) com a galera do trabalho. O mar sempre dá um jeito de aparecer.',
        en: 'Reef tank automation with friends from work. The sea always finds its way in.',
      },
    },
    {
      name: 'kibana-datepicker', year: 2018, lang: 'JavaScript',
      url: 'https://github.com/iurynogueira/kibana-datepicker',
      desc: {
        pt: 'Plugin de datepicker para o Kibana.',
        en: 'Datepicker plugin for Kibana.',
      },
    },
  ];

  const OSS = [
    {
      name: 'Brisanet/ion', lang: 'Angular', badge: { pt: '140+ PRs', en: '140+ PRs' },
      url: 'https://github.com/Brisanet/ion',
      demo: 'https://main--62eab350a45bdb0a5818520e.chromatic.com/',
      desc: {
        pt: 'Design system em Angular da Brisanet e um dos principais trabalhos que fiz na empresa. Contribuí com componentes (table, select, drawer, tabs, tag, upload, datepicker, popconfirm), máscaras de formulário, testes e documentação.',
        en: "Brisanet's Angular design system, one of the main projects I worked on there. I contributed components (table, select, drawer, tabs, tag, upload, datepicker, popconfirm), form masks, tests and docs.",
      },
    },
    {
      name: 'brasil-geojson', lang: 'GeoJSON', stars: 5,
      url: 'https://github.com/iurynogueira/brasil-geojson',
      desc: {
        pt: 'GeoJSON do Brasil separado por estado, pronto pra mapas.',
        en: 'Brazil GeoJSON split by state, ready for maps.',
      },
    },
    {
      name: 'aprendiz-brisanet', lang: 'API', stars: 4,
      url: 'https://github.com/iurynogueira/aprendiz-brisanet',
      desc: {
        pt: 'Material sobre APIs para o programa de jovens aprendizes da Brisanet.',
        en: "Material about APIs for Brisanet's young apprentice program.",
      },
    },
  ];

  const FORKS = [
    { name: 'angular', url: 'https://github.com/iurynogueira/angular' },
    { name: 'ng-zorro-antd', url: 'https://github.com/iurynogueira/ng-zorro-antd' },
    { name: 'ngx-toastr', url: 'https://github.com/iurynogueira/ngx-toastr' },
    { name: 'actual', url: 'https://github.com/iurynogueira/actual' },
    { name: 'aircraft (flybywire)', url: 'https://github.com/iurynogueira/aircraft' },
  ];

  // Stack servida como cardápio de cafeteria
  const MENU = [
    {
      drink: { pt: 'Espresso duplo', en: 'Double espresso' },
      stack: 'Angular · TypeScript · RxJS',
      note: { pt: 'todo dia, desde cedo', en: 'every day, first thing' },
      price: '★★★★★',
    },
    {
      drink: { pt: 'Coado na V60', en: 'V60 pour-over' },
      stack: 'Node.js · Express',
      note: { pt: 'filtrado, limpo, sem pressa', en: 'filtered, clean, unhurried' },
      price: '★★★★★',
    },
    {
      drink: { pt: 'Café de garrafa', en: 'Batch brew' },
      stack: 'Governança de TI · ITIL · IA · Automação de processos',
      note: { pt: 'processo bem definido, xícara igual pra todo mundo', en: 'well-defined process, same great cup for everyone' },
      price: '★★★★★',
    },
    {
      drink: { pt: 'Cappuccino', en: 'Cappuccino' },
      stack: 'React · React Native',
      note: { pt: 'de vez em quando, com espuma', en: 'now and then, extra foam' },
      price: '★★★★',
    },
    {
      drink: { pt: 'Affogato', en: 'Affogato' },
      stack: 'Svelte',
      note: { pt: 'sobremesa de fim de semana', en: 'weekend dessert' },
      price: '★★★',
    },
    {
      drink: { pt: 'Cold brew', en: 'Cold brew' },
      stack: 'Go · Bun · TensorFlow.js',
      note: { pt: 'experimentos de extração lenta', en: 'slow-steeped experiments' },
      price: '★★★',
    },
    {
      drink: { pt: 'Cortado', en: 'Cortado' },
      stack: 'Ruby on Rails',
      note: { pt: 'pequeno e forte', en: 'small and strong' },
      price: '★★',
    },
  ];

  const MENU_EXTRAS = {
    pt: ['Clean Architecture', 'Design Systems', 'Storybook', 'Testes unitários', 'CI/CD', 'Vite · Rollup', 'Vercel', 'Microfrontends'],
    en: ['Clean Architecture', 'Design Systems', 'Storybook', 'Unit testing', 'CI/CD', 'Vite · Rollup', 'Vercel', 'Microfrontends'],
  };

  const I18N = {
    pt: {
      htmlLang: 'pt-BR',
      title: 'Iury Nogueira · dev fullstack',
      skip: 'Pular para o conteúdo',
      nav: { home: 'inicio', projects: 'programação', oss: 'open-source', menu: 'cardápio' },
      textNav: 'Digite uma página ou comando e aperte Enter',
      notFound: 'CANAL NÃO ENCONTRADO',
      noSignal: 'SEM SINAL',
      fileProtocol: 'SEM SINAL — ABRA VIA SERVIDOR (localhost)',
      mute: 'MUDO',
      volume: 'VOLUME',
      chPrev: 'Canal anterior',
      chNext: 'Próximo canal',
      cups: (n) => `☕ ×${n} hoje`,
      cupsTitle: 'cafés tomados hoje (estimativa bem científica)',
      langBtn: 'EN',
      langLabel: 'Switch to English',
      sound: (on) => (on ? '♪ SOM ON' : '♪ SOM OFF'),
      soundLabel: 'Ligar ou desligar o som',
      hint: '← → ou 0–6 troca o canal · M som · P desliga · / digita',
      powerHint: 'TV desligada — aperte P ou clique pra ligar',
      soundHint: '♪ clique ou aperte qualquer tecla pra ouvir o mar',
      dateLocale: 'pt-BR',
      bio: `
        Oi! Eu sou o <span class="me" tabindex="0">Iury Nogueira</span>,
        dev fullstack <button class="link-btn" data-channel="1">cearense</button> de Juazeiro do Norte.
        Trabalho principalmente com Angular e Node/Express e, de vez em quando, brinco com React e Svelte.
        <br><br>
        Hoje, na <a href="https://github.com/Brisanet" target="_blank" rel="noopener noreferrer">Brisanet</a>,
        trabalho com governança de TI, ITIL, IA e automação de processos da empresa.
        Um dos meus principais trabalhos por lá foi o <a href="#/open-source">Ion</a>, nosso design system em Angular.
        <br><br>
        Fora do editor, sou <button class="link-btn" data-channel="${COFFEE_CHANNEL}">barista</button>
        e levo café tão a sério quanto código. Quando dá, fujo pra
        <button class="link-btn" data-channel="2">praia</button>, por isso esta TV só passa
        <button class="link-btn" data-action="next">ondas</button> o dia inteiro.
        Em casa, o mar vem em miniatura: um <a href="https://github.com/espoo-dev/the_reef" target="_blank" rel="noopener noreferrer">aquário de recife de corais</a> automatizado, claro.
        <br><br>
        Bora trocar uma ideia? De preferência com um café. Me chama por
        <a href="${LINKS.email}">e-mail</a>.`,
      projects: {
        title: 'Grade de programação',
        lead: 'Projetos pessoais, estudos e experimentos. Os mais novos passam primeiro.',
        demo: 'no ar ↗',
        code: 'código ↗',
      },
      oss: {
        title: 'Open-source',
        lead: 'Onde eu contribuo e o que deixei aberto pra quem quiser usar.',
        forksTitle: 'Forks que eu acompanho',
        forksLead: 'Projetos que estudo de perto (e um simulador de voo, porque ninguém é de ferro).',
      },
      menu: {
        title: 'Cardápio',
        lead: 'Minha stack, servida do jeito que eu tomo café.',
        extras: 'Acompanhamentos',
        footnote: '* consumo sujeito a mais café.',
      },
    },
    en: {
      htmlLang: 'en',
      title: 'Iury Nogueira · fullstack dev',
      skip: 'Skip to content',
      nav: { home: 'home', projects: 'schedule', oss: 'open-source', menu: 'menu' },
      textNav: 'Type a page or command and press Enter',
      notFound: 'CHANNEL NOT FOUND',
      noSignal: 'NO SIGNAL',
      fileProtocol: 'NO SIGNAL — OPEN VIA A SERVER (localhost)',
      mute: 'MUTE',
      volume: 'VOLUME',
      chPrev: 'Previous channel',
      chNext: 'Next channel',
      cups: (n) => `☕ ×${n} today`,
      cupsTitle: 'cups of coffee today (very scientific estimate)',
      langBtn: 'PT',
      langLabel: 'Mudar para português',
      sound: (on) => (on ? '♪ SOUND ON' : '♪ SOUND OFF'),
      soundLabel: 'Toggle sound',
      hint: '← → or 0–6 change channel · M sound · P power · / to type',
      powerHint: 'TV is off — press P or click to turn on',
      soundHint: '♪ click or press any key to hear the sea',
      dateLocale: 'en-US',
      bio: `
        Hi! I'm <span class="me" tabindex="0">Iury Nogueira</span>,
        a fullstack dev from Juazeiro do Norte, <button class="link-btn" data-channel="1">Ceará</button>, Brazil.
        I mostly work with Angular and Node/Express, and every now and then I play with React and Svelte.
        <br><br>
        Currently at <a href="https://github.com/Brisanet" target="_blank" rel="noopener noreferrer">Brisanet</a>,
        I work on IT governance, ITIL, AI and automating the company's processes.
        One of my main projects there was <a href="#/open-source">Ion</a>, our Angular design system.
        <br><br>
        Away from the editor I'm a <button class="link-btn" data-channel="${COFFEE_CHANNEL}">barista</button>
        who takes coffee as seriously as code. Whenever I can I run off to the
        <button class="link-btn" data-channel="2">beach</button>, which is why this TV only plays
        <button class="link-btn" data-action="next">waves</button> all day long.
        At home the sea comes in miniature: a <a href="https://github.com/espoo-dev/the_reef" target="_blank" rel="noopener noreferrer">coral reef tank</a>, automated, of course.
        <br><br>
        Want to chat? Preferably over coffee. Reach me by
        <a href="${LINKS.email}">e-mail</a>.`,
      projects: {
        title: 'TV schedule',
        lead: 'Side projects, studies and experiments. Newest on air first.',
        demo: 'live ↗',
        code: 'code ↗',
      },
      oss: {
        title: 'Open-source',
        lead: "Where I contribute and what I've left open for anyone to use.",
        forksTitle: 'Forks I keep an eye on',
        forksLead: "Projects I study closely (and a flight sim, because why not).",
      },
      menu: {
        title: 'Menu',
        lead: 'My stack, served the way I drink coffee.',
        extras: 'Sides',
        footnote: '* consumption subject to more coffee.',
      },
    },
  };

  // Comandos aceitos na barra de navegação digitável
  const COMMANDS = [
    { aliases: ['inicio', 'home', 'index', 'sobre', 'about'], go: '#/' },
    { aliases: ['programacao', 'projetos', 'projects', 'schedule', 'repos', 'work'], go: '#/projects' },
    { aliases: ['open-source', 'opensource', 'oss', 'ion', 'contribuicoes'], go: '#/open-source' },
    { aliases: ['cardapio', 'menu', 'stack', 'skills'], go: '#/menu' },
    { aliases: ['github', 'git', 'codigo', 'code'], url: LINKS.github },
    { aliases: ['linkedin', 'cv', 'curriculo', 'resume'], url: LINKS.linkedin },
    { aliases: ['instagram', 'insta', 'fotos', 'photos'], url: LINKS.instagram },
    { aliases: ['devto', 'dev.to', 'blog', 'artigos', 'posts'], url: LINKS.devto },
    { aliases: ['email', 'e-mail', 'contato', 'contact', 'mail'], url: LINKS.email },
    { aliases: ['cafe', 'coffee', 'barista', 'espresso', 'v60'], action: 'coffee' },
    { aliases: ['praia', 'beach', 'mar', 'sea', 'ferias', 'vacation'], action: 'beach' },
    { aliases: ['estatica', 'static', 'ruido', 'noise', 'chiado'], action: 'static' },
    { aliases: ['desligar', 'off', 'power', 'dormir', 'sleep'], action: 'power' },
  ];

  return { LINKS, CHANNELS, COFFEE_CHANNEL, PROJECTS, OSS, FORKS, MENU, MENU_EXTRAS, I18N, COMMANDS };
})();
