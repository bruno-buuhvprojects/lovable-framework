import './globals.js';
export { registerRoutes, getRoutes } from './registry.js';
export { BrowserRouteDataProvider } from './components/BrowserRouteDataProvider.js';
export { default as RouterService } from './router/RouterService.js';
export { RouteDataProvider, useRouteData, buildRouteKey, } from './router/RouteDataContext.js';
export { AppRoutes } from './components/AppRoutes.js';
export { render, } from './ssr/render.js';
