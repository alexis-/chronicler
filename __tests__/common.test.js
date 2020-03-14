import test from 'ava'
import { prWebHook } from '../fixtures/webhook-event'
import { isTooOld } from '../src/helpers/common'
import {
  getPrData
} from '../src/helpers/pr'

const pr = getPrData(prWebHook)

test.beforeEach(() => {
  process.env.GH_TOKEN = 'MOCK_TOKEN'
})

test('isTooOld returns true if PR was merged more than 5 minutes ago', t => {
  t.true(isTooOld(pr.merged_at))
})

test('isTooOld returns false if PR was merged within 5 minutes', t => {
  // the current time
  t.false(isTooOld(new Date()))
})