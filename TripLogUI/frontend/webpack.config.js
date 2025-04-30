// webpack.config.js
module.exports = {
    // Other Webpack configurations...
    module: {
      rules: [
        {
          test: /\.js$/,
          enforce: 'pre',
          use: ['source-map-loader'],
          exclude: [
            /node_modules\/react-datepicker/, // Ignore source map warnings for react-datepicker
          ],
        },
      ],
    },
  };