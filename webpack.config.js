var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    entry: getEntrySources([
      path.resolve(__dirname, 'app/js/entry.js'),
    ]),
    output: getOutput(),
    plugins: [
      new HtmlWebpackPlugin({
        title: "marg: " + IS_PRODUCTION
      })
    ],
    devtool: 'eval',
    module: {
        preLoaders: getPreLoaders(),
        loaders: getLoaders()
    }
};

function getEntrySources(sources) {
    if (!IS_PRODUCTION) {
        sources.push('webpack-dev-server/client?http://localhost:8080');
        sources.push('webpack/hot/dev-server');
    }

    return sources;
}

function getOutput() {
  var outputDir = IS_PRODUCTION ? "dist" : "build";

  return {
    path: path.resolve(__dirname, outputDir),
    filename: 'bundle.js'
  };
}

function getLoaders() {
  var loaders = [
    {
        test: /\.scss$/,
        include: /app/,
        loader: 'style!css!sass',
    },
    {
        test: /\.jsx?$/,
        exclude: /(node_modules|bower_components)/,
        loaders: [
            'react-hot',
            'babel?stage=0'
        ]
    }
  ];

  if (IS_PRODUCTION) {
  } else {
  }

  return loaders;
}

function getPreLoaders() {
  if (IS_PRODUCTION) {
    return [{
      test: /\.jsx?$/,
      exclude: /(node_modules|bower_components)/,
      loader: 'source-map'
    }];
  } else {
    return [];
  }
}
