import { useEffect } from 'react';
import { useSEOContext } from './SEOContext.js';
function upsertMeta(doc, selector, attrs) {
    let el = doc.querySelector(selector);
    if (!el) {
        el = doc.createElement('meta');
        doc.head.appendChild(el);
    }
    Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
}
function applySEODOM(props) {
    if (typeof document === 'undefined')
        return;
    document.title = props.title;
    upsertMeta(document, 'meta[name="description"]', {
        name: 'description',
        content: props.description,
    });
    if (props.noindex) {
        upsertMeta(document, 'meta[name="robots"]', {
            name: 'robots',
            content: 'noindex, nofollow',
        });
    }
    if (props.url) {
        let canon = document.querySelector('link[rel="canonical"]');
        if (!canon) {
            canon = document.createElement('link');
            canon.setAttribute('rel', 'canonical');
            document.head.appendChild(canon);
        }
        canon.setAttribute('href', props.url);
    }
    upsertMeta(document, 'meta[property="og:title"]', {
        property: 'og:title',
        content: props.title,
    });
    upsertMeta(document, 'meta[property="og:description"]', {
        property: 'og:description',
        content: props.description,
    });
    upsertMeta(document, 'meta[property="og:type"]', {
        property: 'og:type',
        content: props.type ?? 'website',
    });
    if (props.url) {
        upsertMeta(document, 'meta[property="og:url"]', {
            property: 'og:url',
            content: props.url,
        });
    }
    if (props.image) {
        upsertMeta(document, 'meta[property="og:image"]', {
            property: 'og:image',
            content: props.image,
        });
    }
    upsertMeta(document, 'meta[name="twitter:card"]', {
        name: 'twitter:card',
        content: 'summary_large_image',
    });
    upsertMeta(document, 'meta[name="twitter:title"]', {
        name: 'twitter:title',
        content: props.title,
    });
    upsertMeta(document, 'meta[name="twitter:description"]', {
        name: 'twitter:description',
        content: props.description,
    });
    if (props.image) {
        upsertMeta(document, 'meta[name="twitter:image"]', {
            name: 'twitter:image',
            content: props.image,
        });
    }
    if (props.structuredData) {
        let script = document.querySelector('script[data-seo-jsonld]');
        if (!script) {
            script = document.createElement('script');
            script.setAttribute('type', 'application/ld+json');
            script.setAttribute('data-seo-jsonld', '');
            document.head.appendChild(script);
        }
        script.textContent = JSON.stringify(props.structuredData);
    }
}
/**
 * Centralized SEO: meta tags and JSON-LD.
 * SSR: reports to context for head injection.
 * Client: updates document.title and meta via useEffect.
 */
export function SEO(props) {
    const ctx = useSEOContext();
    if (ctx)
        ctx.setMeta(props);
    useEffect(() => {
        applySEODOM(props);
    }, [
        props.title,
        props.description,
        props.image,
        props.url,
        props.type,
        props.noindex,
        props.structuredData ? JSON.stringify(props.structuredData) : null,
    ]);
    return null;
}
