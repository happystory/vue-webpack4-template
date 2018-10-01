const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const OptimizeCSSPlugin = require('optimize-css-assets-webpack-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const baseWebpackConfig = require('./webpack.base.conf');

const baseCssRules = [
  MiniCssExtractPlugin.loader,
  {
    loader: 'css-loader',
    options: {
      sourceMap: false,
    },
  },
  {
    loader: 'postcss-loader',
    options: {
      sourceMap: false,
    },
  },
];

const webpackConfig = merge(baseWebpackConfig, {
  mode: 'production',
  module: {
    rules: [
      {
        test: /\.css$/,
        use: baseCssRules,
      },
      {
        test: /\.scss/,
        use: [
          ...baseCssRules,
          {
            loader: 'sass-loader',
            options: {
              sourceMap: false,
            },
          },
        ],
      },
    ],
  },
  devtool: false,
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: 'static/js/[name].[chunkhash].js',
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        BASE_URL: '"/"',
      },
    }),
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[chunkhash].css',
    }),
    new OptimizeCSSPlugin({}),
    new HtmlWebpackPlugin({
      filename: path.resolve(__dirname, '../dist/index.html'),
      template: path.resolve(__dirname, '../public/index.html'),
      inject: true,
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeRedundantAttributes: true,
        useShortDoctype: true,
        removeEmptyAttributes: true,
        removeStyleLinkTypeAttributes: true,
        keepClosingSlash: true,
        minifyJS: true,
        minifyCSS: true,
        minifyURLs: true,
      },
      chunksSortMode: 'dependency',
      templateParameters: {
        BASE_URL: '/',
      },
    }),
    new webpack.NamedChunksPlugin(),
    new webpack.HashedModuleIdsPlugin(),
    new CopyWebpackPlugin([
      {
        from: path.resolve(__dirname, '../public'),
        to: '',
        ignore: ['index.html'],
      },
    ]),
  ],
  optimization: {
    splitChunks: {
      cacheGroups: {
        vendors: {
          name: 'chunk-vendors',
          test: /[\\\/]node_modules[\\\/]/,
          priority: -10,
          chunks: 'initial',
        },
        common: {
          name: 'chunk-common',
          minChunks: 2,
          priority: -20,
          chunks: 'initial',
          reuseExistingChunk: true,
        },
      },
    },
    runtimeChunk: 'single',
    minimizer: [
      new UglifyJsPlugin({
        uglifyOptions: {
          compress: {
            warnings: false,
          },
        },
        sourceMap: false,
        parallel: true,
      }),
    ],
  },
});

if (process.env.npm_config_report) {
  const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
  webpackConfig.plugins.push(new BundleAnalyzerPlugin());
}

module.exports = webpackConfig;
