const getReferrer = (): string => {
    if (typeof URL !== 'function') {
        return ''
    }
    return document.referrer ? new URL(document.referrer).pathname : ''
}

export default getReferrer