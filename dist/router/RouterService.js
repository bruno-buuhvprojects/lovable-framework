import { getRoutes } from '../registry.js';
function matchPath(pathPattern, pathname) {
    if (pathPattern === '*')
        return true;
    if (pathPattern === pathname)
        return true;
    const segments = pathname.split('/').filter(Boolean);
    const patternSegments = pathPattern.split('/').filter(Boolean);
    let pathIndex = 0;
    for (let i = 0; i < patternSegments.length; i++) {
        const p = patternSegments[i];
        if (p === '*') {
            // * matches any remaining segments (0 or more) — e.g. studio/* matches studio/profile/teste/1
            return true;
        }
        if (pathIndex >= segments.length)
            return false;
        if (p.startsWith(':')) {
            pathIndex++;
            continue;
        }
        if (p !== segments[pathIndex])
            return false;
        pathIndex++;
    }
    return pathIndex === segments.length;
}
function isSsrRoute(pathname) {
    const routes = getRoutes();
    return routes.filter((r) => r.isSSR).some((route) => matchPath(route.path, pathname));
}
function matchRoute(pathname) {
    const routes = getRoutes();
    for (const route of routes) {
        if (matchPath(route.path, pathname))
            return route;
    }
    return routes.find((r) => r.path === '*');
}
function routeParams(routePath, pathname) {
    const pathSegments = pathname?.split('/').filter(Boolean) || [];
    const patternSegments = routePath.split('/').filter(Boolean);
    const params = {
        routeParams: {},
        searchParams: {},
    };
    patternSegments.forEach((segment, i) => {
        if (segment.startsWith(':')) {
            params['routeParams'][segment.slice(1)] = pathSegments[i];
        }
    });
    return params;
}
/** Parses the URL query string (e.g. "?filter=FPS" or "filter=FPS") into key/value pairs. */
function searchParams(queryString) {
    const parsed = new URLSearchParams(queryString);
    return Object.fromEntries(parsed.entries());
}
const RouterService = {
    isSsrRoute,
    matchPath,
    matchRoute,
    routeParams,
    searchParams,
};
export default RouterService;
