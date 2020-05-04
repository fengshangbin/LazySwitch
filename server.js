var express = require("express");
var webpack = require("webpack");
var webpackDevMiddleware = require("webpack-dev-middleware");
var webpackHotMiddleware = require("webpack-hot-middleware");
var webpackConfig = require("./webpack.dev.config");
var serverFilter = require("lazypage-node");

var compiler = webpack(webpackConfig);
var devMiddleware = webpackDevMiddleware(compiler, {
  noInfo: true,
  publicPath: webpackConfig.output.publicPath,
});
var hotMiddleware = webpackHotMiddleware(compiler);

var app = express();
app.use(devMiddleware);
app.use(hotMiddleware);
app.use(serverFilter.filter("test"));
app.use(express.static("test"));

var server = app.listen(8082, function () {
  console.log("LazyPage node.js测试，访问地址为 http://localhost:8082/");
});

//打开默认浏览器
const openDefaultBrowser = function (url) {
  var exec = require("child_process").exec;
  switch (process.platform) {
    case "darwin":
      exec("open " + url);
      break;
    case "win32":
      exec("start " + url);
      break;
    default:
      exec("xdg-open", [url]);
  }
};
openDefaultBrowser("http://localhost:8082");
