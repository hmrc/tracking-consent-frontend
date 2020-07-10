export {}

declare global {
  interface Window {
    optimizely: any[];
    dataLayer: any[];
  }
}
