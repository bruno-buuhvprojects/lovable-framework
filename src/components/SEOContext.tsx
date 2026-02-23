import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

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

const SEOContext = createContext<SEOContextValue | null>(null);

export function useSEOContext(): SEOContextValue | null {
  return useContext(SEOContext);
}

export function SEOProvider({
  children,
  captureRef,
}: {
  children: ReactNode;
  captureRef?: { current: SEOProps | null };
}) {
  const setMeta = (meta: SEOProps) => {
    if (captureRef) captureRef.current = meta;
  };
  return (
    <SEOContext.Provider value={{ setMeta }}>
      {children}
    </SEOContext.Provider>
  );
}
