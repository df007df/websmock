var fs = require('fs');
var path = require('path');



exports.loadHtmlData = function (app, url) {

    var data = {};
    var dataPaths = url.replace(/html/, 'js');
    var dataPath = path.join(app.get('path'), 'mock', 'data', dataPaths);

    if (fs.existsSync(dataPath)) {
        data = require(dataPath).data();

        delete require.cache[dataPath];
    }

    return data;

};



exports.loadWidgetData = function (basePath, name) {

    var data = {};

    var dataPaths = name.replace(/\./g, '/');
    var dataPath = path.join(basePath, 'mock', 'data', 'widgets', dataPaths + '.js');

    if (fs.existsSync(dataPath)) {
        data = require(dataPath).data();

        delete require.cache[dataPath];
    }

    return data;

};


exports.loadApiData = function (app, name) {

    var data = {};

    var dataPaths = name.replace(/api/, '');
    var dataPath = path.join(app.get('path'), 'mock', 'api', dataPaths + '.js');



    if (fs.existsSync(dataPath)) {

        console.log(dataPath);

        data = require(dataPath).data();

        delete require.cache[dataPath];
    }

    return data;

};