const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv').config()

const environment = process.env.NODE_ENV;

console.log('WEBPACK.congfig environment:::::', environment);

let ENVIRONMENT_VARIABLES = {
  'process.env.NODE_ENV': JSON.stringify('development'),
  'process.env.PORT': JSON.stringify('8080'),
  'process.env.MONGO_URI': JSON.stringify('mongodb+srv://dbuser:spelunk123@cluster0.jrsvzmt.mongodb.net/alphamongo?retryWrites=true&w=majority'),
  'process.env.JWT_SECRET': JSON.stringify('JWT_SECRET = Wetterhorn3404')
};

if (environment === 'test') {
  ENVIRONMENT_VARIABLES = {
    'process.env.ENVIRONMENT': JSON.stringify('test'),
    'process.env.PORT': JSON.stringify('8080'),
    'process.env.MONGO_URI': JSON.stringify('mongodb+srv://dbuser:spelunk123@cluster0.jrsvzmt.mongodb.net/alphamongo?retryWrites=true&w=majority'),
    'process.env.JWT_SECRET': JSON.stringify('JWT_SECRET = Wetterhorn3404')
  };
} else if (environment === 'production') {
  ENVIRONMENT_VARIABLES = {
    'process.env.ENVIRONMENT': JSON.stringify('production'),
    'process.env.PORT': JSON.stringify('8080'),
    'process.env.MONGO_URI': JSON.stringify('mongodb+srv://dbuser:spelunk123@cluster0.jrsvzmt.mongodb.net/alphamongo?retryWrites=true&w=majority'),
    'process.env.JWT_SECRET': JSON.stringify('JWT_SECRET = Wetterhorn3404')
  };
}

module.exports = {
    // entry: 'server.js',  
    // entry: './server.js',
    // entry: path.resolve(__dirname, 'backend', 'index.js'),
    entry: path.resolve(__dirname, 'server.js'),
    resolve: {
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'server.js',
  },
  target: 'node',
  plugins: [
    new webpack.DefinePlugin(ENVIRONMENT_VARIABLES),
  ],
};