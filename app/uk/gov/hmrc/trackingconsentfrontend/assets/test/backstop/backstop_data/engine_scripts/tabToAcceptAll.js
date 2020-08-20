// onBefore example (puppeteer engine)
module.exports = async (page) => {
    console.log("Tabbing...")
    await page.keyboard.press("Tab");
    console.log("Tabbing...")
    await page.keyboard.press("Tab");
    console.log("Tabbing to acceptAll button...")
    await page.keyboard.press("Tab");
};
