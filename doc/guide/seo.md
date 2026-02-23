# SEO

The framework provides a central `SEO` component powered by `react-helmet-async`. When used inside pages, it sets meta tags and optional JSON-LD, and the server injects this content into the HTML `<head>` during SSR.

## Requirements

- `BrowserRouteDataProvider` wraps your app with `HelmetProvider` (included by default).
- For SSR, the framework's `render` wraps the tree with `HelmetProvider` and returns helmet data; the server injects it before `</head>`.

## Usage

Import `SEO` from `lovable-ssr` and add it to any page:

```tsx
import { SEO } from 'lovable-ssr';

function VideoPage({ video }) {
  const siteUrl = import.meta.env.VITE_SITE_URL ?? 'https://example.com';

  return (
    <div>
      <SEO
        title={`${video.title} | My App`}
        description={video.description ?? video.title}
        url={`${siteUrl}/video/${video.id}`}
        image={video.thumbnail}
        type="video.other"
        structuredData={{
          '@context': 'https://schema.org',
          '@type': 'VideoObject',
          name: video.title,
          description: video.description,
          thumbnailUrl: video.thumbnail,
          uploadDate: video.created_at,
        }}
      />
      {/* rest of page */}
    </div>
  );
}
```

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `title` | `string` | Yes | Document title (`<title>`, `og:title`, `twitter:title`). |
| `description` | `string` | Yes | Meta description (`meta name="description"`, `og:description`, `twitter:description`). |
| `image` | `string` | No | Image URL for Open Graph and Twitter cards. |
| `url` | `string` | No | Canonical URL and `og:url`. |
| `type` | `string` | No | `og:type` (default: `"website"`). Use `"video.other"`, `"profile"`, etc. for specific types. |
| `noindex` | `boolean` | No | If `true`, adds `meta name="robots" content="noindex, nofollow"`. |
| `structuredData` | `object` | No | JSON-LD object; rendered as `<script type="application/ld+json">`. |

## Example: homepage

```tsx
<SEO
  title="Game Haven Hub - Gameplays e Comunidade Gamer"
  description="Assista gameplays, descubra criadores de conteúdo e faça parte da maior comunidade gamer."
  url={siteUrl}
  image={`${siteUrl}/og-image.png`}
  structuredData={{
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Game Haven Hub',
    url: siteUrl,
    description: 'Assista gameplays e descubra criadores de conteúdo.',
  }}
/>
```

## Sitemap and robots.txt

The framework generates `/sitemap.xml` and `/robots.txt` automatically from the route registry when `sitemap.siteUrl` is set in `createServer`.

### 1. Enable in server config

```ts
createServer({
  root,
  entryPath: 'src/ssr/entry-server.tsx',
  sitemap: { siteUrl: process.env.VITE_SITE_URL ?? 'https://example.com' },
})
  .then((server) => server.listen());
```

### 2. Add sitemap config to routes

Each route can opt in with `sitemap: { include: true, ... }`:

```ts
// Static route
{ path: '/', Component: Index, isSSR: true, sitemap: { include: true, changefreq: 'daily', priority: 1.0 } },
{ path: '/search', Component: SearchPage, isSSR: true, sitemap: { include: true, changefreq: 'daily', priority: 0.8 } },

// Dynamic route — use getEntries to return all URLs
{
  path: '/video/:id',
  Component: VideoPage,
  isSSR: true,
  sitemap: {
    include: true,
    changefreq: 'weekly',
    priority: 0.8,
    getEntries: async ({ siteUrl }) => {
      const api = new ApiClient();
      const { data } = await api.getFeedVideos({ limit: 500 });
      return (data?.videos ?? []).map((v) => ({
        loc: `${siteUrl}/video/${v.id}`,
        lastmod: v.created_at?.split('T')[0],
      }));
    },
  },
},
```

### SitemapRouteConfig

| Field | Type | Description |
|-------|------|-------------|
| `include` | `boolean` | Must be `true` to include in sitemap. |
| `changefreq` | `'always' \| 'hourly' \| 'daily' \| 'weekly' \| 'monthly' \| 'yearly' \| 'never'` | How often the page changes. |
| `priority` | `number` | 0.0–1.0. |
| `getEntries` | `(ctx: { siteUrl: string }) => Promise<SitemapEntry[]>` | For dynamic routes: returns `{ loc, lastmod?, changefreq?, priority? }[]`. Required when the path has params (e.g. `:id`). |

For static routes (no `:param`), omit `getEntries`; one entry is added automatically.
