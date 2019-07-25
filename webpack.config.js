/**
 * 1、启动server webpack-dev-server
 * 2、模块化开发 commonjs
 * 3、版本号控制 hash chunkhash
 * 4、CSS，SASS 
 * 5、css抽离
 */
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const devMode = process.env.NODE_ENV !== 'production';

function recursiveIssuer(m) {
    if (m.issuer) {
      return recursiveIssuer(m.issuer);
    } else if (m.name) {
      return m.name;
    } else {
      return false;
    }
}

module.exports = {
    // entry: './src/app.js',
    // entry: [__dirname + '/src/app.js','./src/search.js'],
    entry: {
        foo: path.resolve(__dirname, 'src/app'),
        bar: path.resolve(__dirname, 'src/search')
    },
    output: {
        path: __dirname + '/dist',
        filename: 'js/[name]_[hash].js'
    },

    // 启动服务
    devServer: {
        contentBase: './dist',
        port: 8000 
    },
    module: {
        rules: [
            {
                test: /\.(c|le)ss$/,
                use: [
                     MiniCssExtractPlugin.loader,//devMode == 'development'? 'style-loader' :
                    'css-loader',
                    'less-loader',
                ]
            }
        ]
    },
    optimization: {
        splitChunks: {
          cacheGroups: {
            fooStyles: {
              name: 'foo',
              test: (m, c, entry = 'foo') =>
                m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
              chunks: 'all',
              enforce: true,
            },
            barStyles: {
              name: 'bar',
              test: (m, c, entry = 'bar') =>
                m.constructor.name === 'CssModule' && recursiveIssuer(m) === entry,
              chunks: 'all',
              enforce: true,
            },
          },
        },
    },
    // 配置插件
    plugins: [
        // 自动生成html的插件
        new HtmlWebpackPlugin({
            title: 'My App',
            filename: 'test.html',
            template: 'my-template.ejs',
            testExtra: 'hakdhahfah'

        }),
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: devMode ? 'css/[name].css' : 'css/[name].[hash].css',
            chunkFilename: devMode ? 'css/[id].css' : 'css/[id].[hash].css',
        }),
        new OptimizeCSSAssetsPlugin({}),
    ]
}  