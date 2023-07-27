// rollup.config.js
export default {
  // other Rollup configuration options...
  build: {
    rollupOptions: {
      external: [
        '@apollo/client',
        'graphql',
        'apollo-cache-inmemory',
        'apollo-client',
        'apollo-link',
        'apollo-link-http',
        'graphql-tag',
        'autoprefixer',
      ],
    },
  },
};
