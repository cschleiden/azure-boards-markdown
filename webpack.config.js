var path = require("path");
var webpack = require("webpack");
var CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    target: "web",
    entry: {
        registration: "./src/app.ts",
        dialog: "./src/dialog.tsx"
    },
    output: {
        filename: "src/[name].js",
        libraryTarget: "amd"
    },
    externals: [
        /^VSS\/.*/, /^TFS\/.*/, /^q$/
    ],
    loaders: [
        {
            test: /\.json$/,
            // We could restrict using json-loader only on .json files in the
            // node_modules/pixi.js directory, but the ability to load .json files
            // could be useful elsewhere in our app, so I usually don't.
            //include: path.resolve(__dirname, 'node_modules/pixi.js'),
            loader: 'json'
        }
    ],
    resolve: {
        extensions: [
            "",
            ".webpack.js",
            ".web.js",
            ".ts",
            ".tsx",
            ".js"],
        root: [
            path.resolve("./src")
        ]
    },
    module: {
        loaders: [
            {
                test: /\.tsx?$/,
                loader: "ts-loader"
            },
            {
                test: /\.s?css$/,
                loaders: ["style", "css", "sass"]
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin([
            { from: "./node_modules/vss-web-extension-sdk/lib/VSS.SDK.min.js", to: "libs/VSS.SDK.min.js" },
            { from: "./src/*.html", to: "./" },
            { from: "./marketplace", to: "marketplace" },
            { from: "./vss-extension.json", to: "vss-extension-release.json" }
        ])
    ]
}