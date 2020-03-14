import test from 'ava'
import { prWebHook } from '../fixtures/webhook-event'
import {
  getPrDesc,
  getPrData
} from '../src/helpers/pr'

const pr = getPrData(prWebHook)

test.beforeEach(() => {
  process.env.GH_TOKEN = 'MOCK_TOKEN'
})

test('getPrDesc should return the formatted description for a pull request with title and number', t => {
  const expected = '- Update README.md (#16)'

  t.is(getPrDesc(pr), expected)
})

test('getPrData should return a pull request object with the repository url', t => {
  if (!pr.repoUrl) {
    return t.fail()
  }

  return t.pass()
})

test.todo(
  'handleReleasesResponse calls editReleaseDraft if there is an existing release draft'
)

test.todo(
  'handleReleasesResponse calls createReleaseDraft if there is an existing release draft'
)
