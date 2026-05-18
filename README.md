# Adivina el Número

Juego web de adivinanza con estética cyberpunk. Adivina un número secreto del **1 al 10** en máximo **3 intentos**.

Construido con [Astro](https://astro.build) y TypeScript vanilla (sin frameworks de UI).

## Características

- **Modo manual:** tú eliges el número secreto y otro jugador intenta adivinarlo.
- **Modo aleatorio:** el sistema genera el número al azar.
- **Efecto glitch** en el código encriptado mientras juegas.
- **3 intentos** con indicadores visuales.
- **Internacionalización (i18n):** español e inglés, con preferencia guardada en `localStorage`.
- **Tema claro / oscuro:** conmutador en la barra superior; respeta `prefers-color-scheme` si no hay preferencia guardada.
- Diseño responsive con tipografías Orbitron y Rajdhani.
- Atajo de teclado: **Enter** para enviar.

## Demo

> Puedes desplegar la carpeta `dist/` en GitHub Pages, Netlify o Vercel tras ejecutar `pnpm build`.

## Requisitos

- [Node.js](https://nodejs.org/) 18 o superior
- [pnpm](https://pnpm.io/) 11.x (recomendado vía Corepack)

```bash
corepack enable
corepack prepare pnpm@11.1.3 --activate
```

## Instalación

```bash
git clone https://github.com/alfredmr/alfredmr-avidivaNumero-Astro.git
cd alfredmr-avidivaNumero-Astro
pnpm install
```

## Scripts

| Comando        | Descripción                          |
| -------------- | ------------------------------------ |
| `pnpm dev`     | Servidor de desarrollo en `:4321`    |
| `pnpm build`   | Genera el sitio estático en `dist/`   |
| `pnpm preview` | Previsualiza el build de producción  |

## Estructura del proyecto

```
avidivaNumero-Astro/
├── public/
├── src/
│   ├── components/
│   │   ├── AppToolbar.astro    # Selector de idioma y tema
│   │   └── AppFooter.astro     # Pie de página
│   ├── i18n/
│   │   ├── en.ts               # Cadenas en inglés
│   │   ├── es.ts               # Cadenas en español
│   │   └── index.ts            # API de traducción (t, setLocale)
│   ├── layouts/
│   │   └── Layout.astro        # Shell HTML, fuentes y fondo
│   ├── pages/
│   │   └── index.astro         # Página principal del juego
│   ├── scripts/
│   │   ├── game.ts             # Lógica del juego
│   │   ├── i18n-dom.ts         # Aplica traducciones al DOM
│   │   └── preferences.ts      # Idioma, tema y barra de herramientas
│   └── styles/
│       └── global.css          # Estilos globales y temas
├── astro.config.mjs
├── package.json
└── pnpm-lock.yaml
```

## Cómo jugar

1. Elige **Yo elijo** o **Aleatorio** (botones EN/ES en la esquina superior si prefieres otro idioma).
2. En modo manual, ingresa un número del 1 al 10 y pulsa **Iniciar misión**.
3. Intenta adivinar el código con hasta 3 suposiciones.
4. Gana si aciertas; pierde si se agotan los intentos.
5. Usa **Reiniciar juego** para volver al inicio.

## Preferencias

| Preferencia | Clave en `localStorage` | Valores        |
| ----------- | ----------------------- | -------------- |
| Idioma      | `locale`                | `en`, `es`     |
| Tema        | `theme`                 | `light`, `dark` |

Si no hay tema guardado, se usa el del sistema operativo.

## Despliegue

### Build estático

```bash
pnpm build
```

La salida queda en `dist/`. Súbela a cualquier hosting de sitios estáticos.

### GitHub Pages (ejemplo)

1. En el repositorio: **Settings → Pages → Source**: GitHub Actions.
2. Crea `.github/workflows/deploy.yml` que ejecute `pnpm build` y publique `dist/`.

## Tecnologías

- [Astro](https://astro.build) 5
- TypeScript
- CSS vanilla (variables, animaciones, glassmorphism, temas `data-theme`)

## Licencia

Proyecto de código abierto. Siéntete libre de usarlo y modificarlo.
