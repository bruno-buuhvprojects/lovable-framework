import type React from 'react';
export type ComponentWithGetData = React.ComponentType<any> & {
    getData?: (params?: Record<'routeParams' | 'searchParams', Record<string, string>>) => Promise<Record<string, unknown>>;
};
export type RouteConfig = {
    path: string;
    Component: ComponentWithGetData;
    isSSR: boolean;
};
//# sourceMappingURL=types.d.ts.map