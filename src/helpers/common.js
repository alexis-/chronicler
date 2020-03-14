import moment from 'moment'

/**
 * Compares the merged time to the current time and determines if the pr or
 * commit was merged too long ago. They should be merged within 5 minutes
 * of a webhook  event in order to be added to the release draft. Prevents
 * duplicates if multiple webhook events are sent for older PRs and commits.
 *
 * @param {String} time pr or commit merge timestamp
 */
export const isTooOld = time => {
  const now = moment()
  const mergedAt = moment(time)
  const diff = now.diff(mergedAt, 'minutes')

  return diff > 5
}

/**
 * Handling Errors using async/await
 * Has to be used inside an async function
 * 
 * @param {Object} err the axios error object
 * @param {String} msg a custom message to prepend
 */
export const handleAxiosEx = ( err, msg ) => {
  if (err.response) {
    /*
     * The request was made and the server responded with a
     * status code that falls out of the range of 2xx
     */
    
    return `${msg}
Status: ${err.response.status}
Headers: ${err.response.headers}
Message: '${err.response.data.message}'`
  } else if (err.request) {
    /*
     * The request was made but no response was received, `error.request`
     * is an instance of XMLHttpRequest in the browser and an instance
     * of http.ClientRequest in Node.js
     */
    return `${msg}
Request: ${err.request}`
  } else if (err.stack) {
    return `${msg}
Error: ${err}
Stack: ${err.stack}`
  }
  else {
    // Something happened in setting up the request and triggered an Error
    return `${msg}
Message: ${err.message}`
  }
}

export default isTooOld