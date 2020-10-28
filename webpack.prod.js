const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base');

const UglifyJSPlugin = require('uglifyjs-webpack-plugin'); // 不支持ES6语法，神奇哦，使用terser-webpack-plugin代替
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = merge(base, {
    mode: 'production',
    // devtool: 'isource-map',
    plugins: [
        new CleanWebpackPlugin(), // 无需指定目录，会自动找到配置的输出目录进行清除
        new ManifestPlugin(), // 输出打包文件清单
        new OptimizeCSSAssetsPlugin({

        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: "[name].[hash].css",
            chunkFilename: "[id].css"
        }),
        // 将dll文件列表追加只manifest.json
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require('./build/library/library.manifest.json')
            // manifest: require(path.resolve(__dirname, '../build/library/library.manifest.json')),
        }),
        // new UglifyJSPlugin({
        //     sourceMap: true
        // }),
        // 输出环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),
        // 将build文件夹中的文件copy只打包目录dist
        new CopyWebpackPlugin({
            patterns: [
                { from: './build/library', to: '' }
            ]
        }),
        new HtmlWebpackPlugin({
            title: '输出模版',
            // template: // 如果不指定template的话，HtmlWebpackPlugin插件将会生成一个默认的模版
            // template: './src/index.html',
            template: path.resolve(__dirname, 'src/index.html'),
            inject: true
        }),
        // 在文件底部引入dll打包的文件包
        new HtmlWebpackTagsPlugin({
            //需要引入的文件
            tags: [`${require('./build/library/library.manifest.json').name}.js`],
            //加载末尾
            append: false
        }),
    ],
    optimization: {
        minimize: true, //取代 new UglifyJsPlugin(/* ... */)
        minimizer: [new TerserPlugin({
            //开启并行压缩，true为默认值，可设数值， 同样项目小不建议使用，可能反而延长时间
            parallel: true,
            //开启压缩缓存
            cache: true,
            // parallel: true, // 多线程打包
        })], // 自定义压缩配置，比如用什么插件来压缩代码
        splitChunks: { // 代码分割配置
            chunks: "initial",
            minSize: 30000, //模块大于30k会被抽离到公共模块
            minChunks: 1, //模块出现2次就会被抽离到公共模块
            maxAsyncRequests: 5, //异步模块，一次最多只能被加载5个
            maxInitialRequests: 3, //入口模块最多只能加载3个
            name: true,
            cacheGroups: {
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true,
                },
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
    },

})