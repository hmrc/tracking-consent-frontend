const loader = require('../src/loaders/message-format-loader');

module.exports = {
  process: () => {
    console.log('HERE')
    return {
      code: loader()
    }
  },
};
