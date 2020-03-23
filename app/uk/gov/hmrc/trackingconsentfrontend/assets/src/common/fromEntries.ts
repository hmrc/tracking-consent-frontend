const fromEntries = <T>(entries: [string?, T?][]) => entries.reduce(
    (accumulator: {}, [key, value]): {} => (key ? { ...accumulator, [key]: value } : { ...accumulator }), {}
)

export default fromEntries