const loader = require('../src/loaders/message-format-loader');

module.exports = {
  process: (sourceText) => {
    console.log('sourceText', sourceText)
    return {
      code: loader(sourceText)
    }
  },
};
