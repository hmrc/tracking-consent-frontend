import getCurrentScript from "../common/getCurrentScript";

// IE compatible method for parsing URL
const extractPortFromUrl = (src: string): string | undefined => {
    var anchor: HTMLAnchorElement = document.createElement("a");
    anchor.href = src;
    const port = anchor.port
    if (port === '') {
        return undefined
    }
    return port
}

const getPort = (): string | undefined => {
    const scriptTag: HTMLScriptElement | undefined = getCurrentScript()
    if (scriptTag === undefined) {
        return undefined
    }

    const src: string | null = scriptTag.getAttribute('src')
    if (src === null) {
        return undefined
    }

    return extractPortFromUrl(src)
}

const getLocalBaseUrl = (): string => {
    const port = getPort()
    if (port === undefined) {
        return ''
    }
    return `http://localhost:${port}`
}

export default getLocalBaseUrl
