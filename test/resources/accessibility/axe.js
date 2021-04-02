const axe = require('axe-core')
const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const readable = process.stdin;
let content = ''

readable.on('readable', () => {
    let chunk;
    while (null !== (chunk = readable.read())) {
        content += chunk
    }
});

readable.on('end', () => {
    const dom = new JSDOM(content);
    const { window } = dom
    const { document } = window

    const config = {
        rules: {
            'color-contrast': { enabled: false },
            'link-in-text-block': { enabled: false }
        }
    };

    axe
        .run(document.documentElement, config)
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
});
