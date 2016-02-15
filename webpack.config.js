module.exports = {
    entry: './app/Main.jsx',
    output: {
        filename: 'build/bundle.js'
    },
    module: {
        loaders: [
            {
                test: /\.scss$/,
                loader: "style!css!sass"
            },
            {
                test: /\.jsx?$/,
                exclude: /(node_modules|bower_components)/,
                loaders: [
                    // 'react-hot',
                    'babel?presets[]=react,presets[]=es2015'
                ]
            }
        ]
    }
};