module.exports = async (page) => {
    console.log("Tabbing to rejectAdditional button...")
    await page.keyboard.press("Tab");
    await page.keyboard.press("Tab");
};
