const child_process = require ( 'child_process' );
const vnu = require ( 'vnu-jar' );

const child = child_process.spawn(
    'java',
    [`-jar ${vnu}`, '--exit-zero-always', '--stdout', '--format json', '-'],
    { shell: true, stdio: ['inherit', 'pipe', 'pipe'] }
)

let output = ''
child.stdout.on('data', function (data) {
    output += data.toString('utf8')
});

child.stdout.on('end', () => {
    const vnuErrors = JSON.parse(output).messages.filter(({ type }) => type === 'error')
    if (vnuErrors.length > 0) {
        console.error(JSON.stringify(vnuErrors, undefined, '\t'))
        process.exit(1)
    }
})

child.stderr.on('data', function (data) {
    console.error("An unexpected error occurred running vnu: " + data)
    process.exit(1)
})
