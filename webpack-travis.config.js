const path = require("path");
const webpack = require("webpack");

const { VueLoaderPlugin } = require('vue-loader');

module.exports = {
    mode: "development",
    entry: "./src/main.ts",

    output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "www")
    },

    devtool: "inline-source-map",

    resolve: {  
        extensions: [".js", ".css", '.vue', ".ts"],
        alias: {
            "stats"                         : path.join(__dirname, "node_modules/three/examples/js/libs/stats.min.js"),
            "vue$"                          : path.join(__dirname, "node_modules/vue/dist/vue.esm.js")
        }
    },

    plugins:[
        new webpack.ProvidePlugin({
            "THREE": "three"
        }),
        new VueLoaderPlugin()
    ],

    module: {
        rules: [
            { 
                test: /\.css$/, use: [ "style-loader", "css-loader" ] 
            },
            {
                test: /\.scss$/,
                use: [
                  'vue-style-loader',
                  'css-loader',
                  {
                    loader: 'sass-loader',
                    options: {
                      includePaths: ["src/style"]
                      //data:  './src/style/_vars.scss'
                    }
                  }
                ]
            },
            { 
                test: /\.ts$/, 
                exclude: /node_modules|vue\/src/,
                loader: 'ts-loader',
                options: {
                    appendTsSuffixTo: [/\.vue$/]
                }
            },
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    esModule: true, 
                    loaders: {
                        'scss': 'vue-style-loader!css-loader!sass-loader',
                        'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax'
                    }
                }
            },
            {
                test: /\.txt$/,
                use: "raw-loader"
            },
            {
                test: /\.html$/,
                use: "raw-loader"
            },
            { 
                test: /\.jpg$/, 
                use: [ "file-loader" ] 
            },
            { 
                test: /\.png$/, 
                use: [ "url-loader?mimetype=image/png" ] 
            }
        ]
    }

};