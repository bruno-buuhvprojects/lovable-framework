# Routes

## Define routes

Import the types from the framework and define your route list:

```ts
// src/routes.ts (or src/application/routes.ts)
import {
  registerRoutes,
  type RouteConfig,
  type ComponentWithGetData,
} from 'lovable-ssr';
import HomePage from '@/pages/HomePage';
import VideoPage from '@/pages/VideoPage';
import NotFound from '@/pages/NotFound';

export type { RouteConfig, ComponentWithGetData };

export const routes: RouteConfig[] = [
  { path: '/', Component: HomePage, isSSR: true },
  { path: '/video/:id', Component: VideoPage, isSSR: true },
  { path: '/signup', Component: SignupPage, isSSR: false },
  { path: '*', Component: NotFound, isSSR: false },
];

registerRoutes(routes);
```

## RouteConfig

| Field       | Type     | Description                                      |
| ----------- | -------- | ------------------------------------------------ |
| `path`      | `string` | Path pattern (e.g. `/`, `/video/:id`, `*`)       |
| `Component` | `React.ComponentType` | Page component (may have `getData`) |
| `isSSR`     | `boolean`| If `true`, the server will run SSR for this path |

## Register once

You must call `registerRoutes(routes)` before any use of the router or `AppRoutes`:

- **Client**: import your routes module in `App.tsx` (or `main.tsx`) so it runs on load.
- **SSR entry**: the entry-server imports the routes module and calls `registerRoutes(routes)` before calling the framework’s `render`. The SSR server **preloads the entry module at startup** (before the first request), so the registry is filled and `RouterService.isSsrRoute(pathname)` works. Do **not** import the routes module in `server.ts` — that would load React components in plain Node and can cause “React is not defined”.

The framework uses this registry for `RouterService.matchRoute`, `RouterService.isSsrRoute`, and for `AppRoutes` to render the list of routes.
