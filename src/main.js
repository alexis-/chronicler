import express from 'express'
import bodyParser from 'body-parser'
import auth from './helpers/auth'
import handlePushEvent from './helpers/push'
import handlePullRequestEvent from './helpers/pr'
import logger from './helpers/logger'

const app = express()
const PORT = process.env.NODE_PORT || 8080

app.use(bodyParser.json())

// health check endpoint
app.get('/ping', (req, res) => {
  return res.status(200).send('OK')
})

app.post('/webhooks', (req, resp) => {
  // authenticate request
  const authentication = auth(req)
  
  if (authentication.error) {
    return resp.status(authentication.error).send(authentication)
  }

  let promise

  if (req.body.commits)
    promise = handlePushEvent(req.body)

  else if (req.body.pull_request)
    promise = handlePullRequestEvent(req.body)

  else
    return resp.status(200).send('ignored')

  promise
    .then(result => {
      if (result && result.error) {
        return Promise.reject(result.error)
      }

      logger.info(result)

      return resp.status(200).send('Webhooks')
    })
    .catch(error => {
      logger.error(error)

      return resp.status(500).send(error)
    })
})

app.listen(PORT, () => {
  logger.info(`listening on port ${PORT}`)
})
