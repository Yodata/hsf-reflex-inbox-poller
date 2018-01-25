# hsf-reflex-inbox-poller

Processes messages from hsf.ds.bhhsresource.com/inbox with handleMessage.js

### handleMessage operations
- inspects message.object.recipient for inboxes on the ds.bhhsresource.com domain.
- attempts to send the message to any found recipient inboxes
  - uses the api-key of the vendor (loaded from environment vars) so ACL permissions will be honored
  
### version 0.0.2 changes
- messages will not beforwarded to user/affiliate inboxes when
  1. the message is from RED
  2. acceptedByMember is false

## Configuration

### logging
```bash
## use export DEBUG to control which components/events are logged

## all components will be printed
export DEBUG=hsf:*
export DEBUG_DEPTH=5
```

### credentials

```bash
export YODATA_API_KEY=...
export REAL_ESTATE_DIGITAL_YODATA_API_KEY=...
export SMARTER_AGENT_YODATA_API_KEY=...
```

## API

#### Options

* `inboxURL` - _String_ - The inbox URL
* `handleMessage` - _Function_ - A function to be called whenever a message is received.
* `inbox` - _Object_ optional pre-configured inbox to use (useful for testing with a mocked inbox);

### `.start()`

Start polling for messages.

### `.stop()`

Stop polling for messages.

### Event lifecycle

Each poller is an [`EventEmitter`](http://nodejs.org/api/events.html) and emits the following events:

service:start               - service was started
service:process:start       - poll/process loop started
inbox:fetch:completed       - successfully polled the inbox
inbox:fetch:failed          - inbox polling failed (timeout/authorization/network)
inbox:empty                 - all available messages have been processed (wait and retry)

message:process:completed   - handleMessage has processed the message without error
message:process:failed      - handleMessage throw an error processing a message

response:process:completed  - current batch of messages have been processed 
** response:process:failed  - an unhandled error was thrown while processing messages (service will stop)

service:process:completed   - poll/process loop ended normally
** service:process:failed   - poll/process loop ended with errors (service will stop)

service:stop                - app.stop() was called
service:stop:completed      - service has stopped.
```
