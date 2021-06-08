module.exports = async (page) => {
    console.log("Tabbing to skip link...")
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
};
