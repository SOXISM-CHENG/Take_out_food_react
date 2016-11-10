/*eslint no-console:0 */
'use strict';

// -- api server

var http = require("http");
var Api = require("./server_api_define.js").Api;

var api_root_dir = __dirname + "/../Take_out_food_react_api";;
console.log("root_dir : " + api_root_dir)

var api = new Api();
var server = http.createServer();
server.on("request", function(request, response) {
	api.dispatch(request, response, api_root_dir);
});
server.listen(7390);

console.log("-- file api server is running at 7390 port.\n");

// -- react hot replace

require('core-js/fn/object/assign');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const config = require('./webpack.config');
const open = require('open');

new WebpackDevServer(webpack(config), config.devServer)
	.listen(config.port, 'localhost', (err) => {
		if (err) {
			console.log(err);
		}
		console.log('Listening at localhost:' + config.port);
		// console.log('Opening your system browser...');
		// open('http://localhost:' + config.port + '/#/');
	});