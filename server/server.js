var express = require("express");
var multer = require('multer');
var app = express();
var storage = multer.diskStorage({
  destination: function (request, file, callback) {
    callback(null, 'apk');
  },
  filename: function (request, file, callback) {
    callback(null, 'app.apk');
  }
});
var upload = multer({ storage : storage}).fields([{name: 'apk'}, {name: 'packageName'}, {name: 'delayMs'}, {name: 'numberOfEvents'}]);
var exec = require('child_process').exec;
var filesystem = require('fs');
var SHELL_FILE = "./shell/monkeyrunner.sh";
var PORT_NUMBER = 3000;

function runShellScript(packageName, delayMs, numberOfEvents) {
    console.log("*** NEW JOB ***");
    console.log("*** Package: " + packageName);
    console.log("*** Delay: " + delayMs);
    console.log("*** Events: " + numberOfEvents);

    exec("sh " + SHELL_FILE + " " + packageName + " " + delayMs + " " + numberOfEvents, function(error, stdout, stderr) {
        if (error !== null) {
            console.log("*** SHELL ERROR ***");
            console.log("*** ERROR: " + error);
            console.log("*** STDOUT: " + stdout);
        }

        console.log("*** FINISHED JOB ***");
    });
}

function displayHtmlPage(response, fileName) {
    response.sendFile(__dirname + "/html/" + fileName);
}

app.get('/',function(request, response) {
    displayHtmlPage(response, "index.html")
});

app.post('/upload/apk',function(request, response) {
    upload(request, response, function(error) {
        if (error) {
            displayHtmlPage(response, "error.html");
        }

        var packageName = request.body.packageName;
        var delayMs = request.body.delayMs;
        var numberOfEvents = request.body.numberOfEvents;

        runShellScript(packageName, delayMs, numberOfEvents);
        displayHtmlPage(response, "success.html");
    });
});

app.listen(PORT_NUMBER,function() {
    console.log("*** SERVER SETUP ON PORT " + PORT_NUMBER + " ***");
});
