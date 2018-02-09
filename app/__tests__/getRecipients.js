const expect = require('expect')
describe('getRecipients', () => {
  const getRecipients = require('../getRecipients')

  test('no recipient returns an empty array', () => {
    expect.assertions(4)
    expect(getRecipients()).toEqual([])
    expect(getRecipients({})).toEqual([])
    expect(getRecipients(null)).toEqual([])
    expect(getRecipients({recipient: null})).toEqual([])
  })

  test('supports recipient.id or @id', () => {
    expect.assertions(3)
    expect(getRecipients({recipient: [{'@id': 'test/profile/card#me'}]})).toEqual(['test/inbox/'])
    expect(getRecipients({recipient: [{'id': 'test/profile/card#me'}]})).toEqual(['test/inbox/'])
    expect(getRecipients({recipient: [{'id': 'a/profile/card#me'}, {'@id': 'b/profile/card#me'}]})).toEqual(['a/inbox/', 'b/inbox/'])
  })

  test('recipient value can be string', () => {
    expect(getRecipients({recipient: 'test/profile/card#me'})).toEqual(['test/inbox/'])
    expect(getRecipients({recipient: ['test/profile/card#me']})).toEqual(['test/inbox/'])
  })

  test(`recipient value can be a url`, () => {
    let url = 'http://httpbin.org/post'
    return expect(getRecipients({recipient: url})).toEqual([url])
  })

  test('recipient can reference inbox url or profile/card#me', done => {
    expect.assertions(2)
    expect(getRecipients({recipient: [{id: 'test/inbox/'}]})).toEqual(['test/inbox/'])
    expect(getRecipients({recipient: [{'@id': 'test/profile/card#me'}]})).toEqual(['test/inbox/'])
    done()
  })
})
