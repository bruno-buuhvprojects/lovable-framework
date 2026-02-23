import { jsx as _jsx } from "react/jsx-runtime";
import { renderToString } from 'react-dom/server';
import { HelmetProvider } from 'react-helmet-async';
import { StaticRouter } from 'react-router-dom/server';
import { AppRoutes } from '../components/AppRoutes.js';
import { RouteDataProvider } from '../router/RouteDataContext.js';
import RouterService from '../router/RouterService.js';
/**
 * Renders the app for a single URL. Called once per request with that request's URL.
 * getData is invoked only for the route that matches this URL (never for all routes).
 */
export async function render(url, options) {
    const fullUrl = new URL(url, 'http://localhost');
    const pathname = fullUrl.pathname || '/';
    const matchedRoute = RouterService.matchRoute(pathname);
    const params = matchedRoute
        ? RouterService.routeParams(matchedRoute.path, pathname)
        : {
            routeParams: {},
            searchParams: {},
        };
    const searchParams = matchedRoute ? RouterService.searchParams(fullUrl.search) : {};
    params.searchParams = searchParams;
    params.request = options?.requestContext;
    let preloadedData = { is_success: true };
    const getData = matchedRoute?.Component?.getData;
    if (typeof getData === 'function') {
        try {
            preloadedData = await getData(params);
        }
        catch (e) {
            console.error(`SSR getData failed for ${matchedRoute?.path}:`, e);
            preloadedData = { ...preloadedData, is_success: false };
        }
    }
    const helmetContext = {};
    const inner = (_jsx(HelmetProvider, { context: helmetContext, children: _jsx(StaticRouter, { location: url, children: _jsx(RouteDataProvider, { initialData: preloadedData, initialRoute: matchedRoute, initialParams: params, children: _jsx(AppRoutes, {}) }) }) }));
    const app = options?.wrap ? options.wrap(inner) : inner;
    const html = renderToString(app);
    const helmet = helmetContext.helmet
        ? {
            title: helmetContext.helmet.title.toString(),
            meta: helmetContext.helmet.meta.toString(),
            link: helmetContext.helmet.link.toString(),
            script: helmetContext.helmet.script.toString(),
        }
        : undefined;
    return { html, preloadedData, helmet };
}
