const assert = require('assert-plus')
const axios = require('axios')
const debug = require('debug')('sendMessage')

function dispatch (event) {
  debug(event)
  return event
}

module.exports = async function (url, message, xApiKey) {
  let result
  try {
    let apiKey = xApiKey || process.env.YODATA_API_KEY
    let res = await axios.post(url, message, {headers: {'x-api-key': apiKey}})
    assert.ok(res.status < 400, 'response.status')
    result = {
      type: 'SendAction',
      actionStatus: 'CompletedActionStatus',
      object: message.id || message.type,
      target: url,
      result: res.status
    }
  } catch (error) {
    result = {
      type: 'SendAction',
      actionStatus: 'FailedActionStatus',
      object: message,
      target: url,
      error: error.message
    }
  }
  dispatch(result)
  return result
}
