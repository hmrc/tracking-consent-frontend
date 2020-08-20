module.exports = async (page) => {
    console.log("Tabbing to skip link...")
    await page.keyboard.press("Tab");
    console.log("Tabbing to cookies link...")
    await page.keyboard.press("Tab");
};
