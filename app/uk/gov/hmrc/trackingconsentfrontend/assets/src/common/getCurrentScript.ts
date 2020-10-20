const getCurrentScript = (): HTMLScriptElement | undefined => {
    const scriptTag: HTMLScriptElement | null = document.querySelector('script[data-id="tracking-consent-frontend"]')
    if (scriptTag === null) {
        return undefined
    }
    return scriptTag
}

export default getCurrentScript