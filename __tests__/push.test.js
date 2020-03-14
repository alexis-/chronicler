import test from 'ava'
import { commitWebHook } from '../fixtures/webhook-event'
import {
  getPushDesc,
  getPushData
} from '../src/helpers/push'

const push = getPushData(commitWebHook)

test.beforeEach(() => {
  process.env.GH_TOKEN = 'MOCK_TOKEN'
})

test('getPushDesc should return the formatted description for a pull request with title and number', t => {
  const expected = '- 1st commit, line 1 (#1)\r\n- 1st commit, line 2 (#2)\r\n- 2nd commit, line 1 (#3)\r\n- 2nd commit, line 2 (#4)'

  t.is(getPushDesc(push), expected)
})

test('getPushData should return a pull request object with the repository url', t => {
  if (!push.repoUrl) {
    return t.fail()
  }

  return t.is(push.repoUrl, 'https://api.github.com/repos/NYTimes/Chronicler')
})