export const getWelshLanguageEnabled = () => false

const getPort = (): string | undefined => {
    const scriptTag: HTMLScriptElement | null = document.querySelector('script[data-id="tracking-consent-frontend"]')
    if (scriptTag === null) {
        return undefined
    }
    const port: string | null = scriptTag.getAttribute('data-port')
    if (port === null) {
        return undefined
    }
    return port
}

export const getLocalBaseUrl = (): string => {
    const port = getPort()
    if (port === undefined) {
        return ''
    }
    return `http://localhost:${port}`
}
