const readStream = require('./readStream');
const mount = require('./mount');
const runAxeCore = require('./runAxeCore');

async function axe(inputStream) {
  const standardInput = await readStream(inputStream);

  const violations = await runAxeCore(mount(standardInput));
  if (violations.length) {
    throw new Error(JSON.stringify(violations, undefined, '\t'));
  }
}

module.exports = axe;
