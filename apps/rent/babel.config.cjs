module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        modules: false, // preserve ES modules.
        corejs: { version: 3, proposals: true },
      },
    ],
    '@babel/preset-typescript',
    '@vue/app',
  ],
  plugins: [
    [
      '@vue/babel-plugin-jsx',
      {
        enableObjectSlots: true,
      },
    ],
    [
      '@babel/plugin-proposal-decorators',
      {
        legacy: true,
      },
    ],
    ['@babel/plugin-transform-private-property-in-object', { loose: true }],
    ['@babel/plugin-transform-private-methods', { loose: true }],
    ['@babel/plugin-transform-class-properties', { loose: true }],
    '@babel/plugin-transform-typescript',
    '@babel/plugin-transform-object-rest-spread',
    '@babel/plugin-transform-runtime', // enables the re-use of Babel's injected helper code to save on codesize.
  ],
  exclude: [/core-js/],
}
