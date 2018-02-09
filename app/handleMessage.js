const assert = require('assert-plus')
const getRecipients = require('./getRecipients')
const sendMessage = require('./sendMessage')

// IMPORTANT NOTE:
// vendor specific api keys must be set as env variables so
// the polling service can send messages on their behalf without
// breaking the ACL process by sending all messages from the polling service apikey.
// once we have landed on a stable identity platform for vendors this should be updated.
const keys = {
  'https://yodata.io/app/real-estate-digital':
  process.env.REAL_ESTATE_DIGITAL_YODATA_API_KEY,
  'https://yodata.io/app/smarter-agent':
  process.env.SMARTER_AGENT_YODATA_API_KEY
}

module.exports = async function handleMessage (notification) {
  assert.string(notification.id, 'notification.id')
  assert.string(notification.instrument, 'notification.instrument')
  assert.object(notification.object, 'notification.object')
  let message = notification.object
  let acceptedByMember = message.acceptedByMember !== false
  let recipient = getRecipients(message)
  let result = []
  if (acceptedByMember) {
    result = await Promise.all(recipient.map(inboxURL => sendMessage(inboxURL, message, keys[notification.instrument])))
  }
  return {
    id: notification.id,
    instrument: notification.instrument,
    acceptedByMember,
    recipient,
    result
  }
}
