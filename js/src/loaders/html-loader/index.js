const htmlLoader = require('html-loader');

module.exports = {
  process: (src) => ({
    code: htmlLoader(src),
  }),
};
