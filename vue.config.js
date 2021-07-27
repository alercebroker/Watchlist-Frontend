const TerserPlugin = require("terser-webpack-plugin");
module.exports = {
  configureWebpack: (config) => {
    config.optimization.minimize = false
    config.optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          keep_classnames: true,
          keep_fnames: true
        }
      })
    ]
  },

  transpileDependencies: ["vuetify"],

  pluginOptions: {
    s3Deploy: {
      registry: undefined,
      awsProfile: "default",
      overrideEndpoint: false,
      region: "us-east-1",
      bucket: process.env.VUE_APP_AWS_BUCKET_NAME,
      createBucket: false,
      staticHosting: true,
      staticIndexPage: "index.html",
      staticErrorPage: "index.html",
      assetPath: "dist",
      assetMatch: "**",
      deployPath: "/",
      acl: "public-read",
      pwa: false,
      enableCloudfront: false,
      pluginVersion: "4.0.0-rc3",
      uploadConcurrency: 5,
    },
  },
};
