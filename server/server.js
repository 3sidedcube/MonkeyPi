var express = require("express");
var multer = require('multer');
var app = express();
var handlebars = require('handlebars');
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
var SHELL_INSTALL_FILE = "./shell/install.sh";
var SHELL_TEST_FILE = "./shell/test.sh";
var PORT_NUMBER = 3000;

function displayHtmlPage(response, fileName) {
    response.sendFile(__dirname + "/html/" + fileName);
}

app.get('/',function(request, response) {
    displayHtmlPage(response, "index.html")
});

app.post('/install',function(request, response) {
    upload(request, response, function(error) {
        if (error) {
            return displayHtmlPage(response, "error.html");
        }

        var packageName = request.body.packageName;
        var delayMs = request.body.delayMs;
        var numberOfEvents = request.body.numberOfEvents;

        exec("sh " + SHELL_INSTALL_FILE + " " + packageName, function(error, stdout, stderr) {
          if (error !== null) {
            displayHtmlPage(response, "error.html");
          }
        });

        var data = {
            packageName: request.body.packageName,
            delayMs: request.body.delayMs,
            numberOfEvents: request.body.numberOfEvents
        };

        filesystem.readFile('./server/html/installed.html', 'utf-8', function(error, source) {
            var template = handlebars.compile(source);
            var html = template(data);
            response.send(template);
        });

        // displayHtmlPage(response, "installed.html");
    });
});

app.get('/test',function(request, response) {
    exec("sh " + SHELL_TEST_FILE + " " + packageName + " " + delayMs + " " + numberOfEvents, function(error, stdout, stderr) {
      if (error !== null) {
        displayHtmlPage(response, "error.html");
      }
    });

    displayHtmlPage(response, "testing.html");
});

app.listen(PORT_NUMBER,function() {
    console.log("*** SERVER SETUP ON PORT " + PORT_NUMBER + " ***");
});
