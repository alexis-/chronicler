import test from 'ava'
import { prWebHook } from '../fixtures/webhook-event'
import { drafts } from '../fixtures/releases'
import {
  getReleaseIdUrl,
  getReleaseRootUrl,
  updateReleaseDraft
} from '../src/helpers/releases'
import {
  getPrDesc,
  getPrData
} from '../src/helpers/pr'

const pr = getPrData(prWebHook)
const prUrlRepo = pr.repoUrl
const draft = drafts[0]

test.beforeEach(() => {
  process.env.GH_TOKEN = 'MOCK_TOKEN'
})

test('getReleasesUrl returns the url for the github repo releases endpoint', t => {
  const expected =
    'https://api.github.com/repos/NYTimes/Chronicler/releases'

  t.is(getReleaseRootUrl(prUrlRepo), expected)
})

test('getSingleReleaseUrl returns the github release url for a given release id', t => {
  const expected =
    'https://api.github.com/repos/NYTimes/Chronicler/releases/9797693'

  t.is(getReleaseIdUrl(prUrlRepo, draft), expected)
})

test('updateReleaseDraft should append the pull request title and number to existing draft', t => {
  const expect =
    '- Title Change (#4) - Give Props (#3) - Test permissions (#6) - Another Permissions test (#7) - Update README.md (#10) - Update README.md (#12) - Update README.md (#13) - Update README.md (#14) - Update README.md (#15) - Update README.md (#16) - Update README.md (#16) - Add webhook url to readme (#5)\n- Update README.md (#16)'
  t.is(updateReleaseDraft(getPrDesc(pr), draft), expect)
})