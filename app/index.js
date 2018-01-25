const Service = require('yodata-inbox-poller');
const inboxURL = 'https://hsf-test.ds.bhhsresource.com/inbox/';
const handleMessage = require('./handleMessage');

const app = Service.create(inboxURL, handleMessage);

const debug = require('debug');
const { MESSAGE_PROCESS_COMPLETED, MESSAGE_PROCESS_FAILED } = require('./events');

function log(type, props) {
  debug(`hsf:${type}`)(props);
}

app.on('dispatch', event => {
  switch (event.type) {
    case MESSAGE_PROCESS_COMPLETED:
      log(event.type, event.result);
      break;
    case MESSAGE_PROCESS_FAILED:
      log(event.type, event.result);
      break;
    case "service:wait":
      log(event.type, `${event.waitTime} ms`);
      break;
    default:
      log(event.type);
  }
});

app.start();