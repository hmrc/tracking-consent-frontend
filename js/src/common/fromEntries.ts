// Polyfill for Object.fromEntries https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/fromEntries
const fromEntries = <T>(entries: [string, T][]) => entries.reduce(
  (accumulator: {}, [key, value]): {} => ({ ...accumulator, [key]: value }), {},
);

export default fromEntries;
