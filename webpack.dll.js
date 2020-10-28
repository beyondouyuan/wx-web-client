const path = require('path')
const webpack = require('webpack')

const vendors = [
    'react',
    'react-dom',
    'react-router-dom',
]

module.exports = {
    entry: {
        // 将以下包打包成library文件
        library: vendors
    },
    output: {
        filename: '[name]_[hash].js',
        // 打包路径不要放在dist中，否则会被CleanWebpackPlugin清除掉，又得再次打包
        path: path.resolve(__dirname, 'build/library'),
        library: '[name]_[hash]'
    },
    plugins: [
        // 使用dll
        new webpack.DllPlugin({
            name: '[name]_[hash]', // 与output的library名字保持一致
            path: path.join(__dirname, 'build/library/[name].manifest.json')
        })
    ]
}