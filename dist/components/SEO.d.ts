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
export declare function SEO({ title, description, image, url, type, noindex, structuredData, }: SEOProps): import("react/jsx-runtime").JSX.Element;
//# sourceMappingURL=SEO.d.ts.map