var resolve = require('rollup-plugin-node-resolve')

module.exports = {
  entry: 'src/index.js',
  targets: [
    {
      dest: 'dist/boxizer.js',
      format: 'umd'
    },
    {
      dest: 'dist/boxizer.es.js',
      format: 'es'
    }
  ],
  plugins: [resolve()],
  external: ['cloop'],
  moduleName: 'boxizer'
}
