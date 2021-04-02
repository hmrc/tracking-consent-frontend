/* eslint-disable no-console */
const runVnu = require('./src/vnu');

runVnu(process.stdin).catch((error) => {
  console.error(error);
  process.exit(1);
});
