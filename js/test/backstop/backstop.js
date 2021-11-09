const backstop = require('backstopjs');
const backstopConfig = require('./backstopConfig');
const startServer = require('./startServer');

const docker = !process.env.CI;
const port = process.env.VRT_PORT || 8888;
const defaultHost = docker ? 'host.docker.internal' : 'localhost';
const host = process.env.BACKSTOP_TEST_HOST || defaultHost;
const config = backstopConfig({ host, port });
const options = { config, docker };

// eslint-disable-next-line no-console
const log = console.log.bind(console);
// eslint-disable-next-line no-console
const warn = console.warn.bind(console);

const runBackstop = async (command) => {
  const server = await startServer(port);

  try {
    log('Performing visual regression testing');
    await backstop(command, options);
  } catch (err) {
    warn(err);
    warn(err.stack);
    throw err;
  } finally {
    log('Closing server for visual regression testing');
    await server.close();
  }
};

const command = process.argv.slice(2);
runBackstop(command).then(() => {
  log('Finished VRT testing');
  process.exit(0);
}).catch((error) => {
  log(`VRT test failed with error: ${error}`);
  process.exit(1);
});
