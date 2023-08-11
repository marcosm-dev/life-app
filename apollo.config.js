// apollo.config.js
module.exports = {
  client: {
    service: {
      name: 'yoga-graphql',
      url: 'http://localhost:4000/graphql',
    },
    // Files processed by the extension
    includes: [
      'src/**/*.vue',
      'src/**/*.js',
      'src/**/*.ts',
    ],
  },
}
