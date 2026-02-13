import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import express, { type Express, type NextFunction, type Request, type Response } from 'express';
import { createServer as createViteServer, type ViteDevServer } from 'vite';
import RouterService from '../router/RouterService.js';

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

function defaultDistEntryPath(entryPath: string): string {
  return entryPath
    .replace(/^src\//, 'dist/')
    .replace(/\.tsx?$/, '.js');
}

class SsrServer {
  private app: Express;
  private vite: ViteDevServer | undefined;
  private readonly config: Required<CreateServerConfig>;
  private readonly isProd: boolean;

  constructor(config: CreateServerConfig) {
    this.config = {
      root: path.resolve(config.root),
      entryPath: config.entryPath,
      port: config.port ?? 5173,
      cssLinkInDev:
        config.cssLinkInDev ?? '<link rel="stylesheet" href="/src/index.css"></head>',
    };
    this.isProd = process.env.NODE_ENV === 'production';
    this.app = express();
  }

  public static async create(config: CreateServerConfig): Promise<SsrServer> {
    const server = new SsrServer(config);
    await server.configureVite();
    server.configureStaticAssets();
    server.configureRequestHandler();
    return server;
  }

  private async configureVite() {
    if (this.isProd) return;
    this.vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'custom',
      root: this.config.root,
    });
    this.app.use(this.vite.middlewares);
  }

  private configureStaticAssets() {
    if (!this.isProd) return;
    this.app.use(express.static(path.join(this.config.root, 'dist'), { index: false }));
  }

  private configureRequestHandler() {
    this.app.use('*', (req, res, next) => this.handleRequest(req, res, next));
  }

  private async handleRequest(req: Request, res: Response, next: NextFunction) {
    const url = req.originalUrl;
    const pathname = url.replace(/\?.*$/, '').replace(/#.*$/, '') || '/';

    try {
      if (!RouterService.isSsrRoute(pathname)) {
        return await this.renderSpa(url, res);
      }
      return await this.renderSsr(url, res);
    } catch (e) {
      if (this.vite) {
        (this.vite as any).ssrFixStacktrace?.(e as Error);
      }
      next(e);
    }
  }

  private async renderSpa(url: string, res: Response) {
    if (this.vite) {
      let template = this.readTemplate(path.join(this.config.root, 'index.html'));
      template = this.injectCssInDev(template);
      const html = await this.vite.transformIndexHtml(url, template);
      return res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
    }
    const template = this.readTemplate(path.join(this.config.root, 'dist', 'index.html'));
    return res.status(200).set({ 'Content-Type': 'text/html' }).send(template);
  }

  private async renderSsr(url: string, res: Response) {
    const { template, render } = await this.getSsrRenderer();
    const result = await render(url);
    const appHtml = typeof result.html === 'string' ? result.html : '';
    const preloadedData = result.preloadedData ?? {};
    let html = template.replace(
      '<div id="root"></div>',
      `<div id="root">${appHtml}</div>`
    );
    html = this.injectPreloadedData(html, preloadedData);
    if (this.vite) {
      const transformed = await this.vite.transformIndexHtml(url, html);
      return res.status(200).set({ 'Content-Type': 'text/html' }).send(transformed);
    }
    return res.status(200).set({ 'Content-Type': 'text/html' }).send(html);
  }

  private async getSsrRenderer(): Promise<{
    template: string;
    render: (url: string) => Promise<RenderResult>;
  }> {
    if (this.vite) {
      const template = this.injectCssInDev(
        this.readTemplate(path.join(this.config.root, 'index.html'))
      );
      const entry = await this.vite.ssrLoadModule(
        path.join(this.config.root, this.config.entryPath)
      );
      return {
        template,
        render: entry.render as (url: string) => Promise<RenderResult>,
      };
    }
    const template = this.readTemplate(
      path.join(this.config.root, 'dist', 'index.html')
    );
    const distEntryPath = defaultDistEntryPath(this.config.entryPath);
    const entryUrl = pathToFileURL(
      path.join(this.config.root, distEntryPath)
    ).href;
    const entry = await import(entryUrl);
    return {
      template,
      render: entry.render as (url: string) => Promise<RenderResult>,
    };
  }

  private readTemplate(fullPath: string): string {
    return fs.readFileSync(fullPath, 'utf-8');
  }

  private injectCssInDev(html: string): string {
    if (!this.vite) return html;
    return html.replace('</head>', this.config.cssLinkInDev);
  }

  private injectPreloadedData(
    html: string,
    preloadedData: Record<string, unknown>
  ): string {
    if (Object.keys(preloadedData).length === 0) return html;
    const script = `<script>window.__PRELOADED_DATA__=${JSON.stringify(
      preloadedData
    )};</script>`;
    return html.replace('</body>', `${script}</body>`);
  }

  public listen(port?: number, callback?: () => void) {
    const p = port ?? this.config.port;
    this.app.listen(p, callback ?? (() => {
      console.log(`SSR server running at http://localhost:${p}`);
    }));
  }

  public getApp(): Express {
    return this.app;
  }
}

export async function createServer(config: CreateServerConfig): Promise<{
  getApp: () => Express;
  listen: (port?: number, callback?: () => void) => void;
}> {
  const server = await SsrServer.create(config);
  return {
    getApp: () => server.getApp(),
    listen: (port?: number, callback?: () => void) =>
      server.listen(port, callback),
  };
}

/** Standalone: run server when this file is executed (e.g. tsx packages/lovable-framework/src/ssr/server.ts).
 * Set env ROOT, ENTRY_PATH, PORT or use defaults. */
export function runServer(config?: Partial<CreateServerConfig>) {
  const root = config?.root ?? process.cwd();
  const entryPath = config?.entryPath ?? 'src/entry-server.tsx';
  const port = config?.port ?? (process.env.PORT ? Number(process.env.PORT) : 5173);
  createServer({ root, entryPath, port, ...config })
    .then((s) => s.listen(port))
    .catch(console.error);
}
