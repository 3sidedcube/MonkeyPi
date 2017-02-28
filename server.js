var express = require("express");
var multer = require('multer');
var app = express();
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, './apk');
  },
  filename: function (request, file, callback) {
    callback(null, 'app-' + Date.now() + '.apk');
  }
});
var upload = multer({ storage : storage}).fields([{name: 'apk'}, {name: 'packageName'}, {name: 'delayMs'}, {name: 'numberOfEvents'}]);
var exec = require('child_process').exec;
var SHELL_FILE = "shell/test.sh";
var PORT_NUMBER = 3000;

function runShellScript() {
    exec('sh ' + SHELL_FILE, function(error, stdout, stderr) {
        console.log('stdout: ' + stdout);
        console.log('stderr: ' + stderr);
        if (error !== null) {
            console.log('execution error: ' + error);
        }
    });
}

function displayHtmlPage(response, fileName) {
    response.sendFile(__dirname + "/html/" + fileName);
}

app.get('/',function(request, response) {
    displayHtmlPage(response, "index.html")
});

app.post('/upload/apk',function(request, response) {
    upload(request, response, function(err) {
        console.log("Package name: " + request.body.packageName);
        console.log("Delay (ms): " + request.body.delayMs);
        console.log("Number of events: " + request.body.numberOfEvents);

        if (err) {
            displayHtmlPage(response, "error.html");
        }

        displayHtmlPage(response, "success.html");
        runShellScript();
        displayHtmlPage(response, "testing.html");
    });
});

app.listen(PORT_NUMBER,function() {
    console.log("Working on port " + PORT_NUMBER);
});
