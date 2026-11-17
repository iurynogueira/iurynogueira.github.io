# IURY·TV

Portfolio do Iury Nogueira: dev fullstack, barista e apaixonado por praia.
O site inteiro é uma TV CRT que só passa ondas do mar (e um canal de café).

Inspirado no [kaisermann.me](https://kaisermann.me/).

## Rodando local

O YouTube não toca vídeos quando o arquivo é aberto direto (`file://`), então suba um servidor:

```bash
python3 -m http.server 8080
# ou
npx serve .
```

E abra http://localhost:8080.

## Controles

| Tecla | Ação |
| --- | --- |
| `0`–`6` | troca de canal (`0` = ruído branco que soa como mar, `6` = canal do barista) |
| `←` `→` (ou `[` `]`) | canal anterior / próximo |
| `M` | liga/desliga o som (vem ligado; o navegador libera o áudio no primeiro clique/tecla) |
| `+` `-` | volume |
| `P` | liga/desliga a TV |
| `L` | PT / EN |
| `/` | foca a barra digitável (ex.: `github`, `cafe`, `cardapio`, `praia`) |

## Editando conteúdo

Está tudo em `js/data.js`:

- `CHANNELS`: os vídeos do YouTube (ID + nome do canal)
- `PROJECTS`, `OSS`, `FORKS`: as listas de repositórios
- `MENU`: a stack em formato de cardápio
- `I18N`: textos em português e inglês

## Deploy no GitHub Pages

O site é estático (HTML/CSS/JS puros, sem build). Pra ele ficar em `https://iurynogueira.github.io`,
o repositório precisa se chamar `iurynogueira.github.io`. Depois é só ativar em
**Settings → Pages → Deploy from branch → main / root**.
