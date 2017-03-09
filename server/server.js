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
        console.log("Request has no body");
        return false;
    }

    var packageName = request.body.packageName;
    var minutes = request.body.minutes;

    if (!packageName || !minutes) {
        console.log("Request does not have packageName or minutes set");
        return false;
    }

    // Minutes input validation
    if (minutes < 5 || minutes > 30) {
        console.log("Minutes input validation failed for input: " + minutes);
        return false;
    }

    return true;
}

app.get('/', function(request, response) {
    return displayHtmlPage("install.html", response);
});

app.get('/install',function(request, response) {
    return displayHtmlPage("install.html", response);
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

app.get('/test',function(request, response) {
    return displayHtmlPage("test.html", response);
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
            minutes: request.body.minutes
        };

        var delayMs = 100;
        var testingMilliseconds = data.minutes * 60000;
        var numberOfEvents = testingMilliseconds / delayMs;

        console.log("Number of events: " + numberOfEvents);
        var startTime = new Date().getTime();

        exec("sh " + SHELL_TEST_FILE + " " + data.packageName + " " + delayMs + " " + numberOfEvents, function(error, stdout, stderr) {
            if (error) {
                console.log("Error executing shell test script: " + error);
                return displayHtmlPage("error.html", response);
            }

            var elapsed = new Date().getTime() - startTime;
            console.log("Testing took " + elapsed + "ms");
            console.log(elapsed);
        });

        displayPage("testing.html", data, response);
    });
});

app.listen(PORT_NUMBER, function() {
    console.log("*** SERVER SETUP ON PORT " + PORT_NUMBER + " ***");
});
