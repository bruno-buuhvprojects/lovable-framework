import { Helmet } from 'react-helmet-async';

export interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  noindex?: boolean;
  structuredData?: object;
}

/**
 * Centralized SEO component for meta tags and JSON-LD.
 * Use within HelmetProvider (provided by framework at app level).
 */
export function SEO({
  title,
  description,
  image,
  url,
  type = 'website',
  noindex = false,
  structuredData,
}: SEOProps) {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
      {url && <link rel="canonical" href={url} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {image && <meta name="twitter:image" content={image} />}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}
    </Helmet>
  );
}
