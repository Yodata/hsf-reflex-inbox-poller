const get = require('lodash.get')
const castArray = require('lodash.castarray')

const inboxURL = (recipient) => {
  let id
  if (typeof recipient === 'string') {
    id = recipient
  } else {
    id = recipient && recipient.id || recipient['@id']
  }
  return id && id.replace('/profile/card#me', '/inbox/').toLowerCase()
}

function getRecipients (message) {
  let result = []
  if (message && message.recipient) {
    if (typeof message.recipient === 'string') {
      result.push(inboxURL(message.recipient))
    } else if (Array.isArray(message.recipient)) {
      message.recipient.forEach(recipient => {
        let url = inboxURL(recipient)
        if (url) result.push(url)
      })
    }
  }
  return result
}

module.exports = getRecipients
