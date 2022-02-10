module.exports = {
  presets: [
    [
      '@babel/preset-env', {
        targets: {
          node: '16.0.0'
        },
      },
    ],
    '@babel/preset-typescript',
  ],
};
