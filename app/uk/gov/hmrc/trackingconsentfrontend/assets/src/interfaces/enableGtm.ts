import getNonce from "../common/getNonce";

const dataLayer = 'dataLayer'
const gtmBaseUrl = 'https://www.googletagmanager.com/gtm.js?id='

const enableGtm = (containerId: string) => {
  (function (window: Window, document: Document, containerId: string) {
    window[dataLayer] = window[dataLayer] || []
    window[dataLayer].push({
      'gtm.start': new Date().getTime(),
      event: 'gtm.js'
    })
    const scriptElement = document.getElementsByTagName('script')[0]
    // FIXME: the below condition extends the vanilla GTM snippet to prevent a console error
    // occurring if a script element has not been defined in the document. We may in future want to
    // consider generating a more informative error to service developers and not initialising
    // the dataLayer in this situation.
    if (scriptElement !== undefined && scriptElement.parentNode !== null) {
      const asyncScriptElement: HTMLScriptElement = document.createElement('script');

      const nonce = getNonce()
      if (nonce !== undefined) {
        asyncScriptElement.setAttribute('nonce',nonce);
      }
      asyncScriptElement.async = true
      asyncScriptElement.src = `${gtmBaseUrl}${containerId}`
      scriptElement.parentNode.insertBefore(asyncScriptElement, scriptElement)
    }
  })(window, document, containerId)
}

export default enableGtm
