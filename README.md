# lovable-ssr

SSR and route data engine for [Lovable](https://lovable.dev) projects: route registry, `getData`, Express + Vite server, and built-in SEO support.

**Documentation:** [Documentação completa](https://calm-meadow-5cf6.github-8c8.workers.dev/)

## Installation

```bash
npm i lovable-ssr
# or
yarn add lovable-ssr
```

Peer dependencies: `react`, `react-dom`, `react-router-dom` (^18 / ^6).

## Quick start

1. Register routes with `registerRoutes(routes)`.
2. Wrap your app with `BrowserRouteDataProvider` and render `AppRoutes` (inside `BrowserRouter`).
3. (Optional) SSR: entry module + `createServer` from `lovable-ssr/server`.
4. (Optional) SEO: add `<SEO />` on pages to set meta tags and JSON-LD; helmet content is injected during SSR.

Details, examples, and API: see the [documentation](https://calm-meadow-5cf6.github-8c8.workers.dev/).

## License

MIT
