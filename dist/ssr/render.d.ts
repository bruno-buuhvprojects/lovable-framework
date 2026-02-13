import type { ReactNode } from 'react';
export interface RenderResult {
    html: string;
    preloadedData: Record<string, unknown>;
}
export interface RenderOptions {
    wrap?: (children: ReactNode) => ReactNode;
}
export declare function render(url: string, options?: RenderOptions): Promise<RenderResult>;
//# sourceMappingURL=render.d.ts.map