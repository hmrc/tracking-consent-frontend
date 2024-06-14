const loader = require('../src/loaders/message-format-loader');

module.exports = {
  // eslint-disable-next-line arrow-body-style
  process: (sourceText) => {
    return {
      code: loader(sourceText),
    };
  },
};
