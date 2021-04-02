/* eslint-disable no-console */
const runAxe = require('./src/axe');

runAxe(process.stdin).catch((error) => {
  console.error(error);
  process.exit(1);
});
