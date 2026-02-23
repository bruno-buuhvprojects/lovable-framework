import type { ReactNode } from 'react';
export interface SEOProps {
    title: string;
    description: string;
    image?: string;
    url?: string;
    type?: string;
    noindex?: boolean;
    structuredData?: object;
}
type SEOContextValue = {
    setMeta: (meta: SEOProps) => void;
};
export declare function useSEOContext(): SEOContextValue | null;
export declare function SEOProvider({ children, captureRef, }: {
    children: ReactNode;
    captureRef?: {
        current: SEOProps | null;
    };
}): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=SEOContext.d.ts.map