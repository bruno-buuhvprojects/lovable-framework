import { type Express } from 'express';
export interface RenderResult {
    html: string;
    preloadedData: Record<string, unknown>;
}
export interface CreateServerConfig {
    root: string;
    /** Path to the app entry-server module relative to root (e.g. 'src/entry-server.tsx') */
    entryPath: string;
    port?: number;
    /** Optional link tag to inject in dev for CSS (e.g. '<link rel="stylesheet" href="/src/index.css">') */
    cssLinkInDev?: string;
}
export declare function createServer(config: CreateServerConfig): Promise<{
    getApp: () => Express;
    listen: (port?: number, callback?: () => void) => void;
}>;
/** Standalone: run server when this file is executed (e.g. tsx packages/lovable-framework/src/ssr/server.ts).
 * Set env ROOT, ENTRY_PATH, PORT or use defaults. */
export declare function runServer(config?: Partial<CreateServerConfig>): void;
//# sourceMappingURL=server.d.ts.map