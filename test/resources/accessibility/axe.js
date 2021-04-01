const axe = require('axe-core')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
const fs = require('fs')

const dom = new JSDOM(fs.readFileSync(process.argv[2], 'utf8'));
const { window } = dom
const { document } = window

const config = {
    rules: {
        'color-contrast': { enabled: false },
        'link-in-text-block': { enabled: false }
    }
};

axe
    .run(document.querySelector("html"), config)
    .then(results => {
        if (results.violations.length) {
            console.error(results.violations)
            process.exit(1)
        }
    })
    .catch(err => {
        console.error('Something bad happened:', err.message);
        process.exit(1)
    });
