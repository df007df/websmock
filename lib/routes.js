var fs = require('fs');
var path = require('path');
var mock = require('./mock');


exports.renderView = function (app, req, res, next) {

    var views = app.get('views');

    //判断view 是否存在
    var path = views + req.originalUrl;

    //console.log(path);

    if (fs.existsSync(path)) {

        var url = req.originalUrl.replace(/^\/+/g,"");
        var data = mock.loadHtmlData(app, url);

        res.render(url, data);

    } else {

        res.send('404');

    }
};


exports.renderApi = function (app, req, res, next) {

    //判断view 是否存在

    var url = req.originalUrl.replace(/^\/+/g,"");
    var data = mock.loadApiData(app, url);

    return res.json(data);

};

//module.exports = routes;