import type { ReactNode } from 'react';
/**
 * Wraps children with RouteDataProvider using initial data from the browser:
 * - window.__PRELOADED_DATA__ (from SSR)
 * - window.location.pathname + RouterService for matchedRoute and routeParams
 *
 * Use this inside BrowserRouter so the app does not need to read __PRELOADED_DATA__
 * or compute initial route/params manually.
 */
export declare function BrowserRouteDataProvider({ children }: {
    children: ReactNode;
}): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=BrowserRouteDataProvider.d.ts.map