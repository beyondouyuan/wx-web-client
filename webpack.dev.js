const path = require('path');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const base = require('./webpack.base');
module.exports = merge(base, {
    mode: 'development',
    devtool: 'inline-source-map',
    plugins: [
        // 输出环境变量
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('development'),
            'baseAPI': JSON.stringify('http://192.168.0.109:8889')
        })
    ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        historyApiFallback: {
            rewrites: [
                { from: /.*/, to: path.posix.join('/', 'index.html') },
            ],
        },
        host: '0.0.0.0',
        compress: true,
        port: 9000,
        hot: true,
        proxy: {
            "/website": {
              target: 'http://192.168.0.109:8889/website',
              pathRewrite: {'^/website' : ''},
              changeOrigin: true
            }
        },
    },

    optimization: {
        minimize: false, // 开发环境不要锁
        namedModules: true, //取代插件中的 new webpack.NamedModulesPlugin()
        namedChunks: true,
        runtimeChunk: {
            name: "runtime"
        }
    }
})