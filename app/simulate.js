const Service = require('yodata-inbox-poller');
const inboxURL = 'some-url';

const debug = require('debug')('hsf:simulation');
const {MESSAGE_PROCESS_COMPLETED, MESSAGE_PROCESS_FAILED} = require('./events');

const timeout = ms => new Promise(res => setTimeout(res, ms));
const handleMessage = async message => {
  await timeout(1500);
  return 'handleMessage response';
};

function log(type, props) {
  debug(`${type}: ${JSON.stringify(props)}`)
}

const app = Service.create(inboxURL, handleMessage);
app.inbox.get = async () => {
  await timeout(2000);
  return {
    type:   'inbox:fetch:completed',
    result: {
      messages: []
    }
  }
};


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
      debug(event.type, event);
  }
});

app.start();
