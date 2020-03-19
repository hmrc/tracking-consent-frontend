const callIfNotNull = (element, callback) => {
    if (element !== null) {
        callback(element)
    }
}

export default callIfNotNull