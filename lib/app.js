var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var routes = require('./routes');


function setBasePath(app, basePath) {

    app.set('path', basePath);
    app.use(express.static(path.join(basePath, 'public')));
}


function setViews(app, basePath) {

    app.set('views', path.join(basePath, 'views'));
    app.engine('.html', require('hbs').__express);
    app.set('view engine', 'html');

}


function setBodyParser(app) {

    // uncomment after placing your favicon in /public
    //app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
    app.use(logger('dev'));
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: false}));
    app.use(cookieParser());

}


function setRoutes(app) {

    app.get('/*.html', function (req, res, next) {

        routes.renderView(app, req, res, next);
    });


    app.get('/api/*', function (req, res, next) {

        routes.renderApi(app, req, res, next);

    });


    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function (err, req, res, next) {
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });

}


exports.Create = function (params) {

    var app = express();

    setBasePath(app, params.path);
    setViews(app, params.path);
    setBodyParser(app);

    setRoutes(app);

    return app;

};

//module.exports = app;