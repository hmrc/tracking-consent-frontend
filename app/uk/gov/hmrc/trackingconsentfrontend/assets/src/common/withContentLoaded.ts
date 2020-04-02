const withContentLoaded = render => (document, ...args) => {
    document.addEventListener('DOMContentLoaded', () => {
        render(document, ...args)
    })
}

export default withContentLoaded