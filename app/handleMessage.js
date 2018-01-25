const assert = require('assert-plus');
const getRecipients = require("./getRecipients");
const sendMessage = require("./sendMessage");

const destInboxURL = "https://yodata-test.ds.bhhsresource.com/inbox/";

const keys = {
  "https://yodata.io/app/real-estate-digital":
  process.env.REAL_ESTATE_DIGITAL_YODATA_API_KEY,
  "https://yodata.io/app/smarter-agent":
  process.env.SMARTER_AGENT_YODATA_API_KEY
};

module.exports = async function handleMessage(notification) {
  assert.string(notification.id, 'notification.id');
  assert.string(notification.instrument, 'notification.instrument');
  assert.object(notification.object, 'notification.object');
  let message = notification.object;
  let acceptedByMember = message.acceptedByMember !== false;
  let recipient = getRecipients(message);
  let result = [];
  if (acceptedByMember) {
    result = await Promise.all(recipient.map(inboxURL => sendMessage(inboxURL, message, keys[notification.instrument])));
  }
  return {
    id:         notification.id,
    instrument: notification.instrument,
    acceptedByMember,
    recipient,
    result
  };
};
