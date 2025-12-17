// @ts-ignore
import fixture from '../fixtures/htmlTransformerTemplate.html';

const transformer = require('../htmlTransformer');

test('transforms html into a JS module exporting a string', () => {
  const result = transformer.process(fixture);

  expect(result).toEqual({
    code: `module.exports = ${JSON.stringify(fixture)};`,
  });
});
