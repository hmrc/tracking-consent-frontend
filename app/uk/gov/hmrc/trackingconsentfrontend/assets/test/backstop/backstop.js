const backstop = require('backstopjs')
const backstopConfig = require('./backstopConfig')
const startServer = require('./startServer')

const docker = !process.env.CI
const port = process.env.VRT_PORT || 8888
const host = docker ? 'host.docker.internal' : 'localhost'
const config = backstopConfig({host, port})
const options = {config, docker}

const runBackstop = async (command) => {
  const server = await startServer(port)

  try {
    console.log('Performing visual regression testing')
    await backstop(command, options)
  } catch (err) {
    throw err
  } finally {
    console.log('Closing server for visual regression testing')
    await server.close()
  }
}

const command = process.argv.slice(2)
runBackstop(command).then(() => {
  console.log('Finished VRT testing')
  process.exit(0)
}).catch(error => {
  console.log('VRT test failed with error: ' + error)
  process.exit(1)
})
