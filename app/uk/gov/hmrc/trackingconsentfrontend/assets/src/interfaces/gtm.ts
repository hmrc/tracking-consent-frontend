const dataLayer = 'dataLayer'
const gtmBaseUrl = 'https://www.googletagmanager.com/gtm.js?id='

const gtm = (containerId: string) => {
  (function (window: Window, document: Document, containerId: string) {
    window[dataLayer] = window[dataLayer] || []
    window[dataLayer].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    })
    const scriptElement = document.getElementsByTagName('script')[0]
    if (scriptElement !== undefined && scriptElement.parentNode !== null) {
      const asyncScriptElement: HTMLScriptElement = document.createElement('script');

      asyncScriptElement.async = true
      asyncScriptElement.src = `${gtmBaseUrl}${containerId}`
      scriptElement.parentNode.insertBefore(asyncScriptElement, scriptElement)
    }
  })(window, document, containerId)
}

export default gtm
