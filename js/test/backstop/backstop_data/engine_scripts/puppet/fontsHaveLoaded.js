module.exports = async (page) => page.waitForFunction(() => {
  return document.fonts.ready.then(() => {
    console.log('Fonts loaded');
    return true;
  });
});