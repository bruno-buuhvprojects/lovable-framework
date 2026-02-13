# Routes

## Define routes

Import the types from the framework and define your route list:

```ts
// src/routes.ts (or src/application/routes.ts)
import {
  registerRoutes,
  type RouteConfig,
  type ComponentWithGetServerData,
} from 'lovable-framework';
import HomePage from '@/pages/HomePage';
import VideoPage from '@/pages/VideoPage';
import NotFound from '@/pages/NotFound';

export type { RouteConfig, ComponentWithGetServerData };

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
| `Component` | `React.ComponentType` | Page component (may have `getServerData`) |
| `isSSR`     | `boolean`| If `true`, the server will run SSR for this path |

## Register once

You must call `registerRoutes(routes)` before any use of the router or `AppRoutes`:

- **Client**: import your routes module in `App.tsx` (or `main.tsx`) so it runs on load.
- **SSR**: import the routes module in your entry-server and call `registerRoutes(routes)` before calling the framework’s `render`.

The framework uses this registry for `RouterService.matchRoute`, `RouterService.isSsrRoute`, and for `AppRoutes` to render the list of routes.
