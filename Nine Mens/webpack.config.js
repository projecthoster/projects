var path = require('path');

module.exports = {
    entry: "./js/script.js",
    output: {
        path: __dirname,
        filename: "js/bundle.js"
    },
    module: {
        loaders: [
            {
                test: path.join(__dirname, 'js'),
                loader: 'babel-loader'
            }
        ]
    },
    watch: true
};