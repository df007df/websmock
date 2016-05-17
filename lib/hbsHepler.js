var hbs = require('hbs');
var express = require('express');
var mock = require('./mock');
var printObject = require('print-object');

var blocks = {};


hbs.registerHelper('extend', function(name, context) {
    var block = blocks[name];
    if (!block) {
        block = blocks[name] = [];
    }

    block.push(context.fn(this)); // for older versions of handlebars, use block.push(context(this));
});

hbs.registerHelper('block', function(name) {

    var val = (blocks[name] || []);

    if (name === 'css') {

        var cssLine = '';
        val.forEach(function(cssPath){
            cssLine += '<link rel="stylesheet" href="' + cssPath +  '">\r\n';
        });


        val = cssLine;

    } else if (name === 'script') {

        var scriptLine = '';
        val.forEach(function(jsPath){
            scriptLine += '<script type="text/javascript" src="' + jsPath + '"></script>\r\n';
        });


        val = scriptLine;

    } else {

        val = val.join('\n');

    }

    // clear the block
    blocks[name] = [];
    return val;
});



hbs.registerHelper('css', function(name) {

    var css = blocks['css'];
    if (!css) {
        css = blocks['css'] = [];
    }

    css.push(name);

});




hbs.registerHelper('script', function(name) {
    var script = blocks['script'];
    if (!script) {
        script = blocks['script'] = [];
    }

    script.push(name);
});



hbs.registerHelper('Widget', function(name, context) {

    var basePath = this.settings.path;
    var data = mock.loadWidgetData(basePath, name);

    return context.fn(data);

});


hbs.registerHelper('prd', function(name) {

    //return printObject(name, {html:true});

    return JSON.stringify(name, null, 4);

});