const webpack = require("webpack")
let baseConfig = require('./webpack.config');
let devConfig = {
	mode: "development"
}
let webpackconfig = Object.assign({}, baseConfig, devConfig);
webpackconfig.entry["lazyswitch"].unshift('webpack-hot-middleware/client?noInfo=true&reload=true');
webpackconfig.plugins.push(new webpack.HotModuleReplacementPlugin());

module.exports = webpackconfig;