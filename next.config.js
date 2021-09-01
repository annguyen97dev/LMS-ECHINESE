var webpack = require("webpack");
module.exports = {
  trailingSlash: true,
  shallowRender: true,
  webpack: function (config, options) {
    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
      })
    );

    return config;
  },
};
