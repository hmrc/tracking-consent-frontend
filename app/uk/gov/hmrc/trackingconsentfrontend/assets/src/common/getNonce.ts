const getNonce = () => {
    const script = document.querySelector('script[nonce]')

    return script instanceof HTMLScriptElement ? script.nonce : undefined
}

export default getNonce
