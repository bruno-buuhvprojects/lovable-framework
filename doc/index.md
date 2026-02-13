# lovable-ssr

SSR and route data engine for [Lovable](https://lovable.dev) projects.

- **Route registry** — register routes once; the framework matches paths and runs `getServerData` on the server and on SPA navigation.
- **Single React tree** — same providers and components for SSR and client; data is keyed by route + params and reused.
- **Express + Vite server** — dev with Vite middleware, production with static `dist/` and the SSR bundle.

## Quick links

- [Getting started](/guide/getting-started) — install and first steps
- [Routes](/guide/routes) — define routes and `registerRoutes`
- [App shell](/guide/app-shell) — `BrowserRouteDataProvider` and `AppRoutes`
- [SSR](/guide/ssr) — entry-server and server setup
- [getServerData](/guide/get-server-data) — loading data per route
- [API](/guide/api) — types, router, context, server config

## Minimal setup

```bash
npm i lovable-ssr
```

```ts
// routes
import { registerRoutes, type RouteConfig } from 'lovable-ssr';
export const routes: RouteConfig[] = [/* ... */];
registerRoutes(routes);
```

```tsx
// App
import './routes';
import { BrowserRouteDataProvider, AppRoutes } from 'lovable-ssr';
import { BrowserRouter } from 'react-router-dom';

export default function App() {
  return (
    <BrowserRouter>
      <BrowserRouteDataProvider>
        <AppRoutes />
      </BrowserRouteDataProvider>
    </BrowserRouter>
  );
}
```

For SSR you add an entry module and a small server that uses `createServer` from `lovable-ssr/server`. See the [guide](/guide/getting-started) for the full flow.
