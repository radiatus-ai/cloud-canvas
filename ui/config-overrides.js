const webpack = require('webpack');

module.exports = function override(config) {
  const fallback = config.resolve.fallback || {};
  Object.assign(fallback, {
    querystring: require.resolve('querystring-es3'),
    process: require.resolve('process/browser'),
    buffer: require.resolve('buffer/'),
  });
  config.devtool = 'eval-source-map';
  config.resolve.fallback = fallback;
  config.plugins = (config.plugins || []).concat([
    new webpack.ProvidePlugin({
      process: 'process/browser',
    }),
  ]);
  return config;
};
