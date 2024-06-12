const loader = require('../src/loaders/message-format-loader');

// module.exports = {
//   process: loader,
// };

module.exports = {
  process(sourceText, sourcePath, options) {
    return {
      code: () => loader(),
    };
  }
}
