import axios from 'axios'
import { Base64 } from 'js-base64'
import { handleAxiosEx } from './common'

// github needs a user agent in the request, setting as app name
const reqHeaders = {
  'User-Agent': process.env.APP_NAME || 'Chronicler',
  'Authorization': `Basic ${Base64.encode(process.env.GH_USER + ':' + process.env.GH_TOKEN)}`
}

/**
 * Create or update the 'Next release' release with the new commit or PR detail
 * 
 * @param {Object} repoUrl the repository url
 * @param {Object} data the new information to be added in the release note
 */
export const createOrUpdateRelease = (repoUrl, data) => {
  // release request options
  const options = {
    method: 'GET',
    url: getReleaseRootUrl(repoUrl),
    headers: reqHeaders
  }

  // make request to releases endpoint
  return axios(options)
    .then(response => handleReleasesResponse(response, repoUrl, data))
    .then(results => results)
    .catch(err => handleAxiosEx(err, 'Request to GitHub releases endpoint failed.'))
}

/**
 * Handle the releases endpoint response by either creating a new release draft
 * if no draft exists or editing the existing draft.
 *
 * @param {Object} response releases response object
 * @param {Object} repoUrl the repository url
 * @param {Object} data the new information to be added in the release note
 */
export const handleReleasesResponse = (response, repoUrl, data) => {
  const releases = response.data

  // the first item in the data should be the most recent release
  const release = releases && releases.length ? releases[0] : null

  // if there's a release draft, append the line item
  if (release && release.draft) {
    return editReleaseDraft(release, repoUrl, data).then(result => result)
  }

  // if there are no releases or the release is not a draft, create a new draft
  if (!release || (release && !release.draft)) {
    return createReleaseDraft(repoUrl, data).then(result => result)
  }
}

/**
 * Make a request to github to edit and existing release draft
 * @param {Object} release github release object
 * @param {Object} repoUrl the repository url
 * @param {Object} data the new information to be added in the release note
 */
export const editReleaseDraft = (release, repoUrl, data) => {
  const options = {
    method: 'PATCH',
    url: getReleaseIdUrl(repoUrl, release),
    headers: reqHeaders,
    data: {
      body: updateReleaseDraft(data, release) // setting to the updated body with new line
    }
  }

  // make PATCH request to create new release
  return axios(options)
    .then(result => {
      if (result.status !== 200) {
        return Promise.reject(result)
      }
    })
    .catch(err => handleAxiosEx(err, 'Could not edit release draft'))
}

/**
 * Create a new release draft using the pull request data
 * @param {Object} repoUrl the repository url
 * @param {Object} data the new information to be added in the release note
 */
export const createReleaseDraft = (repoUrl, data) => {
  const newRelease = {
    name: 'Next release',
    draft: true, // set to true so it doesn't auto publish,
    prerelease: false,
    body: data,
    tag_name: 'UNTAGGED'
  }

  const options = {
    method: 'POST',
    url: getReleaseRootUrl(repoUrl),
    headers: reqHeaders,
    data: newRelease
  }

  return axios(options)
    .then(result => {
      if (result.status !== 201) {
        return Promise.reject(result)
      }
    })
    .catch(err => handleAxiosEx(err, 'Could not create release draft'))
}

/**
 * Update the existing release draft with the new pull request
 * @param {Object} data the new information to be added in the release note
 * @param {Object} release github release object
 *
 * @returns {String}
 */
export const updateReleaseDraft = (data, release) =>
  `${release.body}\n${data}`

/**
 * Get the url for a specific release from ID
 * @param {String} repoUrl the repository url
 * @param {Object} release github release object
 *
 * @returns {String}
 */
export const getReleaseIdUrl = (repoUrl, release) =>
  `${repoUrl}/releases/${release.id}`

/**
 * Get the releases url for the github repo passed
 * @param {String} repoUrl the repository url
 *
 * @returns {String}
 */
export const getReleaseRootUrl = repoUrl =>
  `${repoUrl}/releases`

export default createOrUpdateRelease