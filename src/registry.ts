import type { RouteConfig } from './types.js';

let routes: RouteConfig[] = [];

export function registerRoutes(r: RouteConfig[]): void {
  routes = r;
}

export function getRoutes(): RouteConfig[] {
  return routes;
}
