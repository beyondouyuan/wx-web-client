const path = require('path');
const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin"); // 抽离css文件
const SvgSpriteLoader = require('svg-sprite-loader/plugin');
const loader = require('sass-loader');

const REG_SPRITE_SVG = /__sprite$/;



function folderExists(s) {
    let result = false;
    try {
        fs.accessSync(s);
        result = true;
    } catch (err) {
        result = false;
    }
    return result;
}

function createEntry() {
    const pageDir = path.resolve(__dirname, 'src/pages');
    const entryNames = fs.readdirSync(pageDir);
    const entry = {};

    entryNames.forEach(name => {
        const entryFile = path.resolve(pageDir, name, 'index.jsx');
        // 检测文件是否存在
        if (folderExists(entryFile)) {
            entry[name] = `./${path.relative(__dirname, entryFile)}`;
        }
    });
    return entry;
}

module.exports = {
    entry: {
        app: './src/app.jsx',
    },
    output: {
        filename: '[name].[hash].js',
        path: path.resolve(__dirname, 'dist') // 打包输出路径
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src'), // 根目录入口
            '@components': path.resolve(__dirname, 'src/components'), // 公共组件入
        },
        extensions: ['.ts', '.tsx', '.js', '.jsx', '.json']
    },
    module: {
        rules: [
            {
                test: /\.(scss|css)$/,
                use: [
                    process.env.NODE_ENV === 'development' ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],

            },
            // 处理图片
            {
                test: /\.(jpg|png|svg|gif)/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: '[name][hash:7].[ext]',
                            outputPath: 'assets/images/'
                        }
                    },
                    // {
                    //     loader: 'image-webpack-loader',
                    //     options: {
                    //         mozjpeg: {
                    //             progressive: true,
                    //             quality: 65
                    //         },
                    //         optipng: {
                    //             enabled: false,
                    //         },
                    //         pngquant: {
                    //             quality: '65-90',
                    //             speed: 4
                    //         },
                    //         gifsicle: {
                    //             interlaced: false,
                    //         },
                    //         WebP: {
                    //             quality: 75
                    //         }
                    //     }
                    // }
                ],
                // 不处理icon下的svg
                exclude: path.resolve(__dirname, 'src/components/Icon/svg'),
            },
            // 加载字体
            {
                test: /\.(woff|woff2|eot|ttf|otf)$/,
                use: [
                    'file-loader'
                ]
            },
            // svg
            {
                test: /\.svg$/,
                use: [{
                    loader: 'svg-sprite-loader',
                    options: {
                        symbolId: '[name]',
                        extract: true,
                    },
                }, {
                    loader: 'svgo-loader',
                    options: {
                        plugins: [
                            { removeTitle: true },
                            { convertColors: { shorthex: false } },
                            { convertPathData: false }
                        ]
                    }
                }
                ],
                resourceQuery: REG_SPRITE_SVG, // sprite for reac
                include: path.resolve(__dirname, 'src/components/Icon/svg'),
            },
            {
                test: /\.jsx?$/,   //匹配JS JSX
                use: [{
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/react'],
                        plugins: [
                            [require("@babel/plugin-proposal-decorators"), {
                                "legacy": true
                            }],
                            [require("@babel/plugin-transform-runtime")],
                            [require("@babel/plugin-transform-object-assign")],
                            [require("@babel/plugin-syntax-class-properties")],
                        ]
                    }
                }],
                include: path.resolve(__dirname, 'src'),
                exclude: /node_modules/
            }

        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            title: '输出模版',
            template: './src/index.html',
            inject: true
        }),
        new SvgSpriteLoader(),
    ]
}