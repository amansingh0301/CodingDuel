const http = require('http');
const server = http.createServer(function (req, res) {
    console.log("=====================================================================", req);
    res.write("Hello world");
    console.log("+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++");
    console.log(res);
    res.end();
});
server.listen(8080)