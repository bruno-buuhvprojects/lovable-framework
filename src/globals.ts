declare global {
  interface Window {
    __PRELOADED_DATA__?: Record<string, unknown>;
  }
}

export {};
