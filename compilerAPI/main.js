var request = require('request');
const fs = require('fs')

//var code = fs.readFileSync("code.cpp");
var code = `#include <stdio.h>

int main() {
    int n = 30;
    printf("%d", 5 * n);
}`
var program = {
    script: code,
    language: "c",
    versionIndex: "0",
    clientId: "9584be04aacd0834625be2eb219030b9",
    clientSecret: "829e046a54d4aa83f94d0c53a5da27c75925c200e2e5789e908ba1a875aa7861"
};
request({
    url: 'https://api.jdoodle.com/v1/execute',
    method: "POST",
    json: program
},
    function (error, response, body) {
        console.log('error:', error);
        console.log('statusCode:', response && response.statusCode);
        console.log('body:', body);
    });