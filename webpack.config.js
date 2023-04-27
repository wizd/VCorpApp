const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './index.web.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx|ts|tsx)$/,
        //exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: [
              '@babel/preset-env',
              '@babel/preset-react',
              '@babel/preset-typescript',
            ],
          },
        },
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(gif|jpe?g|png|svg)$/,
        use: {
          loader: 'url-loader',
          options: {
            name: '[name].[ext]',
            esModule: false,
          },
        },
      },
    ],
  },
  resolve: {
    alias: {
      'react-native$': 'react-native-web',
      'react-native-svg$': 'react-native-svg-web',
      'react-native/Libraries/PermissionsAndroid/PermissionsAndroid.js$':
        './src/permissionsAndroidWeb.js',
    },
    extensions: [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ],
  },
  devServer: {
    static: {
      directory: path.join(__dirname, 'public'),
    },
    port: 3000,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    historyApiFallback: true,
  },
  plugins: [
    // ...其他插件
    new webpack.NormalModuleReplacementPlugin(
      /\.(png|jpe?g|gif|bmp)$/i,
      resource => {
        const filePath = resource.request;
        if (
          !filePath.includes('@2x') &&
          !filePath.includes('@3x') &&
          !filePath.includes('@4x')
        ) {
          return;
        }
        const newPath = filePath.replace(/@[2-4]x/g, '');
        resource.request = newPath;
      },
    ),
  ],
};
