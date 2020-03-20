const fromEntries = <T>(entries: [string, T][]) => entries.reduce(
    (accumulator: {}, [key, value]): {} => ({ ...accumulator, [key]: value }), {}
)

export default fromEntries