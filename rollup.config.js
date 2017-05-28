var resolve = require('rollup-plugin-node-resolve')

module.exports = {
  entry: 'src/index.js',
  dest: 'dist/boxizer.js',
  plugins: [resolve()],
  format: 'umd',
  moduleName: 'boxizer'
}
