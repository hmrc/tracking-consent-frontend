module.exports = async (page) => {
    console.log("Enabling rebrand...")
    await page.$eval("html", el => el.classList.add("govuk-template--rebranded"))
};
