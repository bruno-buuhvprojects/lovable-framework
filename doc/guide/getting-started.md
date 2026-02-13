# Getting started

## Installation

```bash
npm i lovable-ssr
```

Peer dependencies: `react` (^18), `react-dom` (^18), `react-router-dom` (^6).

## Overview

1. **Define routes** and call `registerRoutes(routes)` so the framework can match URLs and run `getServerData` when needed.
2. **Wrap your app** with `BrowserRouteDataProvider` and render `AppRoutes` (inside `BrowserRouter`).
3. **(Optional) SSR** — add an entry module that calls the framework’s `render` with your wrappers, and a small server that uses `createServer` from `lovable-ssr/server`.

The framework provides:

- A **route registry** (singleton): you register once; `RouterService` and `AppRoutes` read from it.
- **Route data context**: initial data from SSR (`window.__PRELOADED_DATA__`) and data fetched on client when you navigate to a route that has `getServerData`.
- **SSR render** and **Express + Vite server** (optional).

## Next steps

- [Routes](/guide/routes) — `RouteConfig`, `registerRoutes`, `isSSR`
- [App shell](/guide/app-shell) — `BrowserRouteDataProvider`, `AppRoutes`
- [SSR](/guide/ssr) — entry-server and server script
