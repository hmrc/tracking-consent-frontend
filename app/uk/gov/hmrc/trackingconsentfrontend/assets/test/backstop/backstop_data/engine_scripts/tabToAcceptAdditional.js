module.exports = async (page) => {
    console.log("Tabbing to acceptAdditional button...")
    await page.keyboard.press("Tab");
};
