const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");

module.exports = {
  entry: "./src/index.ts",
  output: {
    filename: "bundle.js",
    path: path.resolve(__dirname, "dist"),
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      favicon: "./src/assets/favicon/favicon-32x32.png",
      template: "./src/template.html",
    }),
  ],
  module: {
    rules: [
      {
        test: /\.(s[ac]ss)|(css)$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      {
        test: /\.(js|jsx|tsx|ts)$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ["*", ".js", ".jsx", ".tsx", ".ts"],
  },
};
