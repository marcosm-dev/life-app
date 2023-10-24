// rollup.config.js
import dynamicImportVars from '@rollup/plugin-dynamic-import-vars'

export default {
  plugins: [
    dynamicImportVars()
  ],
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
        '@apollo/client/core'
      ]
    }
  },
  output: {
    // Indica a Rollup que genere módulos dinámicos
    format: 'esm'
  }
}
