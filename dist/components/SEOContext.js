import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext } from 'react';
const SEOContext = createContext(null);
export function useSEOContext() {
    return useContext(SEOContext);
}
export function SEOProvider({ children, captureRef, }) {
    const setMeta = (meta) => {
        if (captureRef)
            captureRef.current = meta;
    };
    return (_jsx(SEOContext.Provider, { value: { setMeta }, children: children }));
}
