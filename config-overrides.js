
module.exports = function override(config) {
  config.module.rules.push({
    test: /\.js$/,
    enforce: 'pre',
    include: /node_modules\/react-datepicker/,
    use: [
      {
        loader: 'source-map-loader',
        options: {
          filterSourceMappingUrl: (url, resourcePath) => {
            return false; 
          },
        },
      },
    ],
  });
  return config;
};