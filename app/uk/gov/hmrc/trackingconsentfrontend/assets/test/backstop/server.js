const startServer = require('./startServer');

const port = process.env.VRT_PORT || 8888;

startServer(port);
