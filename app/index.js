const Service = require('yodata-inbox-poller')
const inboxURL = process.env.HSF_REFLEX_MASTER_INBOX_URL || 'https://hsf.ds.bhhsresource.com/inbox/'
const handleMessage = require('./handleMessage')

const app = Service.create(inboxURL, handleMessage)

const debug = require('debug')
const { MESSAGE_PROCESS_COMPLETED, MESSAGE_PROCESS_FAILED } = require('./events')

function log (type, props) {
  debug(`hsf:${type}: `)('%j', props)
}

app.on('dispatch', event => {
  switch (event.type) {
    case MESSAGE_PROCESS_COMPLETED:
      log(event.type, event)
      break
    case MESSAGE_PROCESS_FAILED:
      log(event.type, event.result)
      break
    case 'service:wait':
      log(event.type, `${event.waitTime} ms`)
      break
    default:
      log(event.type)
  }
})

app.start()
