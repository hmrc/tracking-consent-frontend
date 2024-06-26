import loader from '../../src/loaders/message-format-loader';

describe('messageFormatLoader', () => {
  const messages = `banner.title = Tell us whether you accept cookies
banner.paragraph1.beforeLink = We use
banner.paragraph1.link.text = cookies to collect information
`;

  it('should translate a messages file', () => {
    const output = loader(messages);

    expect(output).toEqual(`module.exports = {
  "banner.title": "Tell us whether you accept cookies",
  "banner.paragraph1.beforeLink": "We use",
  "banner.paragraph1.link.text": "cookies to collect information"
}`);
  });

  it('should interpret double quotes as single quotes', () => {
    const output = loader('banner.saveConfirmation.paragraph1.beforeLink = You\'\'ve accepted all cookies. You can ');

    expect(output).toEqual(`module.exports = {
  "banner.saveConfirmation.paragraph1.beforeLink": "You've accepted all cookies. You can "
}`);
  });
});
