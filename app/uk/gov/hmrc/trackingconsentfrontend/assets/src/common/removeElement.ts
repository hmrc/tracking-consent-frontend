const removeElement = element => {
    if (element.remove === undefined) {
        // Polyfill for IE10
        if (element.parentNode) {
            element.parentNode.removeChild(element);
        }
    } else {
        element.remove()
    }
}

export default removeElement