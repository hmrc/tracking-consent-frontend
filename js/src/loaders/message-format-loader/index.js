const { parse } = require('dot-properties');

const stripDoubleQuotesFromString = (content) => content.replace(/''/, "'");

const stripDoubleQuotesFromMessages = (messages) => {
  const stripDoubleQuotesFromEntry = ([key, value]) => ([key, stripDoubleQuotesFromString(value)]);

  const strippedEntries = Object.entries(messages).map(stripDoubleQuotesFromEntry);

  return Object.fromEntries(strippedEntries);
};

const process = (content) => {
  const messages = parse(content, false);

  const strippedMessages = stripDoubleQuotesFromMessages(messages);

  return {
    code: `module.exports = ${JSON.stringify(strippedMessages, null, 2)}`
  }
};

module.exports = process;
