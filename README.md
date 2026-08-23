# Product Extractor

A React Router v8 app with categorized product organization and Clerk authentication.

## Features

- 🚀 Server-side rendering
- 🔐 [Clerk](https://clerk.com/) authentication, with dark-mode-aware UI via `@clerk/themes`
- 🌗 Light/dark theme toggle
- 🎨 [shadcn](https://ui.shadcn.com/) components on [Base UI](https://base-ui.com/)
- 🎉 TailwindCSS v4 for styling
- 🔒 TypeScript
- 🧹 [Biome](https://biomejs.dev/) for linting and formatting
- 📖 [React Router docs](https://reactrouter.com/)

## Getting Started

### Installation

Install the dependencies:

```bash
npm install
```

### Environment variables

Copy `.env.local` (not committed) with your own Clerk keys:

```
VITE_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
VITE_CLERK_SIGN_IN_URL=/sign-in
VITE_CLERK_SIGN_UP_URL=/sign-up
VITE_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
VITE_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
```

This project also uses [Convex](https://convex.dev/) as its backend. Run `npx convex dev` in a separate terminal before (or alongside) `npm run dev` — it logs you in, connects the project, and writes `VITE_CONVEX_URL` into `.env.local` automatically on first run. Without it running, data-dependent pages won't load.

### Development

Start the development server with HMR:

```bash
npm run dev
```

Your application will be available at `http://localhost:5173`.

## Building for Production

Create a production build:

```bash
npm run build
```

## Deployment

### Docker Deployment

To build and run using Docker:

```bash
docker build -t my-app .

# Run the container
docker run -p 3000:3000 my-app
```

The containerized application can be deployed to any platform that supports Docker, including:

- AWS ECS
- Google Cloud Run
- Azure Container Apps
- Digital Ocean App Platform
- Fly.io
- Railway

### DIY Deployment

If you're familiar with deploying Node applications, the built-in app server is production-ready.

Make sure to deploy the output of `npm run build`

```
├── package.json
├── package-lock.json (or pnpm-lock.yaml, or bun.lockb)
├── build/
│   ├── client/    # Static assets
│   └── server/    # Server-side code
```

## Linting & Formatting

This project uses [Biome](https://biomejs.dev/) to lint and format the codebase. Run it with:

```bash
npm run lint-format
```

Configuration lives in [`biome.json`](./biome.json), including `css.parser.tailwindDirectives`, which teaches Biome to parse Tailwind-specific at-rules like `@theme` and `@apply` in [`app/app.css`](./app/app.css) instead of flagging them as syntax errors.

If you use VS Code, [`.vscode/settings.json`](./.vscode/settings.json) sets Biome as the default formatter with format-on-save, and disables the built-in CSS validator's `unknownAtRules` warning so it doesn't also flag Tailwind directives.

## Styling

This project uses [Tailwind CSS v4](https://tailwindcss.com/), with light/dark theme tokens defined in [`app/app.css`](./app/app.css) and a `ThemeProvider` ([`app/lib/theme.tsx`](./app/lib/theme.tsx)) that toggles the `.dark` class and persists the choice to `localStorage`.

