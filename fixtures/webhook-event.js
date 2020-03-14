/* Mock github webhook event payload */
export const prWebHook = {
  pull_request: {
    number: 16,
    title: 'Update README.md',
    body: '',
    merged_at: '2018-03-23T21:57:30Z',
    merged: true
  },
  repository: {
    url: 'https://api.github.com/repos/NYTimes/Chronicler'
  }
}

export const commitWebHook = {
  
  ref: 'refs/heads/master',
  before: '0000000000000000000000000000000000000002',
  after: '0000000000000000000000000000000000000000',
  created: false,
  deleted: true,
  forced: false,
  base_ref: null,
  compare: 'https://github.com/Codertocat/Hello-World/compare/6113728f27ae...000000000000',
  commits: [
    {
      sha: '0000000000000000000000000000000000000000',
      message: 'Wrong commit title\n\n- Old commit, this should be appear',
      distinct: false
    },
    {
      sha: '0000000000000000000000000000000000000001',
      message: '1st commit title\n\n- 1st commit, line 1 (#1)\r\n- 1st commit, line 2 (#2)',
      distinct: true
    },
    {
      sha: '0000000000000000000000000000000000000002',
      message: '2nd commit title\n\n- 2nd commit, line 1 (#3)\r\n- 2nd commit, line 2 (#4)',
      distinct: true
    }
  ],
  repository: {
    url: 'https://github.com/NYTimes/Chronicler',
    releases_url: 'https://api.github.com/repos/NYTimes/Chronicler/releases{/id}'
  }
}

export const mockRequest = {
  body: prWebHook,
  headers: {
    // fake signature to mock request header
    'x-hub-signature': 'sha1=52c4274a1ade797a06044f73499fd46c0e5d6ecd'
  }
}