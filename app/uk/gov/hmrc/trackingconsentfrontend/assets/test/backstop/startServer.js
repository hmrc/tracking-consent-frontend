const express = require('express');

// eslint-disable-next-line no-console
const log = console.log.bind(console);

const startServer = async (port) => {
  const app = express();
  app.use('/', express.static('test/backstop/public'));
  app.use('/tracking-consent/tracking.js', express.static('../../../../../../public/tracking.js'));

  log('Start server for visual regression testing');
  const server = app.listen(port, () => log(`Listening at http://localhost:${port}`));
  log(`Server started on port ${port}`);
  return server;
};

module.exports = startServer;
