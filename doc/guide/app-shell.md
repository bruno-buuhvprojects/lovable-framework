# App shell

## BrowserRouteDataProvider + AppRoutes

After routes are registered, use the framework’s components inside your router:

```tsx
// src/App.tsx
import './routes'; // runs registerRoutes(routes)
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

## What they do

- **BrowserRouteDataProvider**  
  Reads `window.__PRELOADED_DATA__` and `window.location.pathname`, uses `RouterService` to get the matched route and params, and wraps children in `RouteDataProvider` with that initial data. You don’t need to declare `Window` or compute initial route/params yourself.

- **AppRoutes**  
  Renders React Router `<Routes>` from the registered routes. For the current location it gets data from the route data context (from SSR or from a client `getServerData` call) and renders the matching page component with that data.

## Manual wiring (optional)

If you prefer to control the initial data (e.g. in tests), you can use `RouteDataProvider` and `RouterService` instead of `BrowserRouteDataProvider`:

```tsx
import { RouterService, RouteDataProvider, AppRoutes } from 'lovable-ssr';

const preloadedData = typeof window !== 'undefined' ? (window.__PRELOADED_DATA__ ?? {}) : {};
const pathname = typeof window !== 'undefined' ? window.location.pathname || '/' : '/';
const matchedRoute = RouterService.matchRoute(pathname);
const routeParams = matchedRoute ? RouterService.routeParams(matchedRoute.path, pathname) : {};

<RouteDataProvider
  initialData={preloadedData}
  initialRoute={matchedRoute}
  initialParams={routeParams}
>
  <AppRoutes />
</RouteDataProvider>
```
