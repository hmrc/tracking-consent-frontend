const express = require('express')

const startServer = async (port) => {
  const app = express()
  app.use('/', express.static('test/backstop/public'))
  app.use('/tracking-consent/a.js', express.static('../../../../../../public/a.js'))

  console.log('Start server for visual regression testing')
  const server = app.listen(port, () => console.log(`Listening at http://localhost:${port}`))
  console.log(`Server started on port ${port}`)
  return server
}

module.exports = startServer
