import isTooOld from './common'
import createOrUpdateRelease from './releases'

/**
 * Create a pull request object that includes repository url
 * @param {Object} param0 webhook event data payload
 *
 * @returns {Object}
 */
export const getPrData = ({ pull_request, repository }) => ({
  ...pull_request,
  repoUrl: repository.url
})

/**
 * Get the formatted pull request description to add to the release draft.
 * Line item formatted as "PR_Title (#PR_number)"
 * @param {Object} pull_request pull request object from webhook event data
 *
 * @returns {String}
 */
export const getPrDesc = ({ number, title }) => `- ${title} (#${number})`

/**
 * Processes the PR event sent by GitHub
 * 
 * @param {Object} webhookData the payload sent by GitHub for the PR webhook
 */
export const handlePullRequestEvent = webhookData => {
  const pr = getPrData(webhookData)

  if (pr.merged && !isTooOld(pr.merged_at)) {
    const data = getPrDesc(pr)
    
    return createOrUpdateRelease(pr.repoUrl, data)
  }

  return Promise.resolve(true)
}

export default handlePullRequestEvent
