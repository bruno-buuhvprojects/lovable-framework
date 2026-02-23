import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Helmet } from 'react-helmet-async';
/**
 * Centralized SEO component for meta tags and JSON-LD.
 * Use within HelmetProvider (provided by framework at app level).
 */
export function SEO({ title, description, image, url, type = 'website', noindex = false, structuredData, }) {
    return (_jsxs(Helmet, { children: [_jsx("title", { children: title }), _jsx("meta", { name: "description", content: description }), noindex && _jsx("meta", { name: "robots", content: "noindex, nofollow" }), url && _jsx("link", { rel: "canonical", href: url }), url && _jsx("meta", { property: "og:url", content: url }), _jsx("meta", { property: "og:title", content: title }), _jsx("meta", { property: "og:description", content: description }), _jsx("meta", { property: "og:type", content: type }), image && _jsx("meta", { property: "og:image", content: image }), _jsx("meta", { name: "twitter:card", content: "summary_large_image" }), _jsx("meta", { name: "twitter:title", content: title }), _jsx("meta", { name: "twitter:description", content: description }), image && _jsx("meta", { name: "twitter:image", content: image }), structuredData && (_jsx("script", { type: "application/ld+json", children: JSON.stringify(structuredData) }))] }));
}
