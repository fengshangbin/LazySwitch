const path = require("path");
const CleanWebpackPlugin = require("clean-webpack-plugin");
const webpack = require("webpack");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    "lazypage-switch": ["./src/index.js"],
  },
  plugins: [
    new CleanWebpackPlugin(["dist"]),
    new webpack.BannerPlugin(
      " lazypage-switch \n by fengshangbin 2019-01-10 \n https://github.com/fengshangbin/LazyPage-switch \n for H5 page switch animation"
    ),
    new MiniCssExtractPlugin({
      filename: "lazypage-switch.css",
    }),
  ],
  output: {
    path: path.resolve(__dirname, "dist"),
    publicPath: "/dist/",
    filename: "[name].js",
    library: "LazyPage",
    libraryTarget: "umd",
  },
  devServer: {
    contentBase: "./examples",
    inline: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
          },
        },
      },
      {
        test: /\.less$/,
        use: [
          MiniCssExtractPlugin.loader,
          { loader: "css-loader" },
          { loader: "less-loader" },
          { loader: "postcss-loader" },
        ],
      },
    ],
  },
  target: "web",
  mode: "production",
};
