var express = require("express");
var multer = require('multer');
var app = express();
app.use(express.static('server/public'));

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

function displayPage(fileName, data, response) {
    if (!data) {
        return displayHtmlPage(fileName, response);
    }

    filesystem.readFile(__dirname + "/html/" + fileName, 'utf-8', function(error, source) {
        if (error) {
            console.log("Error reading template file: " + error);
            return displayHtmlPage("error.html", response);
        }

        var template = handlebars.compile(source);
        var html = template(data);
        response.send(html);
    });
}

function displayHtmlPage(fileName, response) {
    response.sendFile(__dirname + "/html/" + fileName);
}

function validRequest(request) {
    if (!request || !request.body) {
        return false;
    }

    var packageName = request.body.packageName;
    var delayMs = request.body.delayMs;
    var numberOfEvents = request.body.numberOfEvents;

    if (!packageName || !delayMs || !numberOfEvents) {
        return false;
    }

    // Delay input validation
    if (delayMs < 50 || delayMs > 1000) {
        console.log("Delay input validation failed for input: " + delayMs);
        return false;
    }

    // Event input validation
    if (numberOfEvents < 1 || numberOfEvents > 10000) {
        console.log("Event input validation failed for input: " + numberOfEvents);
        return false;
    }

    return true;
}

app.get('/', function(request, response) {
    return displayHtmlPage("index.html", response);
});

app.post('/install', function(request, response) {
    upload(request, response, function(error) {
        if (error) {
            console.log("Error for install request: " + error);
            return displayHtmlPage("error.html", response);
        }

        if (!validRequest(request)) {
            console.log("Invalid install request: " + request);
            return displayHtmlPage("error.html", response);
        }

        var data = {
            packageName: request.body.packageName,
            delayMs: request.body.delayMs,
            numberOfEvents: request.body.numberOfEvents
        };

        exec("sh " + SHELL_INSTALL_FILE + " " + data.packageName, function(error, stdout, stderr) {
            if (error) {
                console.log("Error executing shell install script: " + error);
                return displayHtmlPage("error.html", response);
            }
        });

        displayPage("installed.html", data, response);
    });
});

app.post('/test',function(request, response) {
    upload(request, response, function(error) {
        if (error) {
            console.log("Error for test request: " + error);
            return displayHtmlPage("error.html", response);
        }

        if (!validRequest(request)) {
            console.log("Invalid test request: " + request);
            return displayHtmlPage("error.html", response);
        }

        var data = {
            packageName: request.body.packageName,
            delayMs: request.body.delayMs,
            numberOfEvents: request.body.numberOfEvents
        };

        exec("sh " + SHELL_TEST_FILE + " " + data.packageName + " " + data.delayMs + " " + data.numberOfEvents, function(error, stdout, stderr) {
            if (error) {
                console.log("Error executing shell test script: " + error);
                return displayHtmlPage("error.html", response);
            }
        });

        displayPage("testing.html", data, response);
    });
});

app.listen(PORT_NUMBER, function() {
    console.log("*** SERVER SETUP ON PORT " + PORT_NUMBER + " ***");
});
