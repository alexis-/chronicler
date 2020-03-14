import createOrUpdateRelease from './releases'

const pushRef = process.env.PUSH_REF

/**
 * Create a pull request object that includes repository url
 * @param {Object} param0 webhook event data payload
 *
 * @returns {Object}
 */
export const getPushData = ({ commits, ref, repository }) => ({
  commits: commits.filter(c => c.distinct),
  ref,
  repoUrl: repository.releases_url.substring(0, repository.releases_url.indexOf('/releases{/id}'))
})

/**
 * Get the formatted pull request description to add to the release draft.
 * Line item formatted as "PR_Title (#PR_number)"
 * @param {Object} pull_request pull request object from webhook event data
 *
 * @returns {String}
 */
export const getPushDesc = ({ commits }) => {
  return commits.map(c => c.message.substring(c.message.indexOf('\n\n') + 2)).join('\r\n')
}

/**
 * Processes the PR event sent by GitHub
 * 
 * @param {Object} webhookData the payload sent by GitHub for the PR webhook
 */
export const handlePushEvent = webhookData => {
  const push = getPushData(webhookData)
  
  if ((!pushRef || push.ref == pushRef)) {
    const data = getPushDesc(push)
    
    return createOrUpdateRelease(push.repoUrl, data)
  }

  return Promise.resolve(true)
}

export default handlePushEvent
