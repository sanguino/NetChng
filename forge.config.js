module.exports = {
  "packagerConfig": {},
  "makers": [
    {
      "name": "@electron-forge/maker-zip",
      "platforms": [
        "darwin"
      ]
    }
  ],
  publishers: [
    {
      name: '@electron-forge/publisher-github',
      config: {
        repository: {
          owner: 'me',
          name: 'awesome-thing'
        },
        prerelease: true
      }
    }
  ]
};

