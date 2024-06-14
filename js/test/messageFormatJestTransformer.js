const loader = require('../src/loaders/message-format-loader');

module.exports = {
  process: (sourceText) => {
    return {
      code: loader(sourceText)
    }
  },
};
