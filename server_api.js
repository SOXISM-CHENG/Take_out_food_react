var http = require("http");
var Api = require("./server_api_define.js").Api;

var root_dir = __dirname + "/../qm_api";

var api = new Api();
var server = http.createServer();
server.on("request", function(request, response) {
	api.dispatch(request, response, root_dir);
});
server.listen(7390);

console.log("-- file api server is running at 7390 port.\n");