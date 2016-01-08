var path = require('path');
var HtmlWebpackPlugin = require('html-webpack-plugin');

var IS_PRODUCTION = process.env.NODE_ENV === 'production';

module.exports = {
    entry: getEntrySources([
      path.resolve(__dirname, 'app/js/entry.js'),
    ]),
    output: {
      path: path.resolve(__dirname, getOutputDir()),
      filename: 'bundle.js'
    },
    plugins: [
      new HtmlWebpackPlugin({
        title: "Effective Tax Rate Calculator",
        template: "index-template.html",
        inject: "body"
      })
    ],
    module: {
        preLoaders: getPreLoaders(),
        loaders: getLoaders()
    }
};

function getEntrySources(sources) {
    if (!IS_PRODUCTION) {
        sources.push('webpack/hot/dev-server');
        sources.push('webpack-dev-server/client?http://localhost:8080');
    }

    return sources;
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

function getOutputDir() {
  return IS_PRODUCTION ? "dist" : "build";
}
