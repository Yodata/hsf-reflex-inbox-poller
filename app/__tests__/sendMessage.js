const expect = require('jest-matchers');
const sendMessage = require('../sendMessage');

describe('sendMessage.js', () => {
  let url, message, key;

  beforeEach(() => {
    url = 'http://httpbin.org/post';
    message = {type: 'TestMessage'};
    key = 'apiKey';
  });

  test(`resolves to SendAction`, () => {
    return expect(sendMessage(url, message)).resolves.toMatchObject({
      type:         'SendAction',
      actionStatus: 'CompletedActionStatus',
      object:       expect.anything(),
      target:       url,
      result:       200
    });
  });

  test(`client/auth errors are resolved with FailedActionStatus`, () => {
    url = 'http://httpbin.org/status/403';
    return expect(sendMessage(url, message)).resolves.toMatchObject({
      type:         'SendAction',
      actionStatus: 'FailedActionStatus',
      object:       message,
      target:       url,
      error:        'Request failed with status code 403'
    })
  });

  test(`network errors are resolved with FailedActionStatus`, () => {
    url = 'not.gonna.work';
    return expect(sendMessage(url, message)).resolves.toMatchObject({
      type:         'SendAction',
      actionStatus: 'FailedActionStatus',
      object:       message,
      target:       url,
      error:        expect.any(String)
    })
  });

});
