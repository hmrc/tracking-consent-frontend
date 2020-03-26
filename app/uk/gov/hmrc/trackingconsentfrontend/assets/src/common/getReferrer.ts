const getReferrer = (): string => {
    return document.referrer ? new URL(document.referrer).pathname : ''
}

export default getReferrer