const expect = require('expect');
const handleMessage = require('../handleMessage');

const goodRecipient = {id: 'http://httpbin.org/post'};
const badRecipient = {id: 'http://httpbin.org/status/403'};

describe('handleMessage.js', () => {
  let input;
  beforeEach(() => {
    input = {
      id:         'messageid',
      instrument: 'instrument',
      object:     {
        recipient: []
      }
    }
  });

  test(`response schema`, () => {
    input.object.recipient = [goodRecipient];
    return expect(handleMessage(input)).resolves.toMatchObject({
      id:               input.id,
      instrument:       input.instrument,
      acceptedByMember: true,
      recipient:        expect.any(Array),
      result:           expect.any(Array)
    })
  });

  test(`resolves with actionStatus='FailedActionStatus' if sendMessage fails`, () => {
    input.object.recipient = [badRecipient];
    return expect(handleMessage(input)).resolves.toMatchObject({
      id:               input.id,
      instrument:       input.instrument,
      acceptedByMember: true,
      recipient:        [badRecipient.id],
      result:           [{
        type:         'SendAction',
        actionStatus: 'FailedActionStatus',
        target:       badRecipient.id,
        error:        'Request failed with status code 403'
      }]

    })
  });

});