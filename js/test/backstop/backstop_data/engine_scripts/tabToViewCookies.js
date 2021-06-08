module.exports = async (page) => {
    console.log("Tabbing to cookie settings button...")
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
};
