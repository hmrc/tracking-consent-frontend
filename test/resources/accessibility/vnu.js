const exec = require ( 'child_process' ).exec;
const vnu = require ( 'vnu-jar' );

exec ( `java -jar ${vnu} --exit-zero-always --stdout --format json ${process.argv[2]}`, ( error, stdout ) => {
    if ( error ) {
        console.error("An unexpected error occurred running vnu: " + error)
        process.exit(1)
    }

    const vnuErrors = JSON.parse(stdout).messages.filter(({ type }) => type === 'error')
    if (vnuErrors.length > 0) {
        console.error(JSON.stringify(vnuErrors, undefined, '\t'))
        process.exit(1)
    }
} );
