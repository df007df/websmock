#!/usr/bin/env node

var program = require('commander');
var mkdirp = require('mkdirp');
var os = require('os');
var fs = require('fs');
var stat = fs.stat;

var path = require('path');
var readline = require('readline');
var sortedObject = require('sorted-object');

var _exit = process.exit;
var eol = os.EOL;
var pkg = require('../package.json');

var binwww = require('../lib/www');

var version = pkg.version;

// Re-assign process.exit because of commander
// TODO: Switch to a different command framework
process.exit = exit

// CLI

before(program, 'outputHelp', function () {
    this.allowUnknownOption();
});

program
    .version(version)
    .usage('[options] [dir]')
    .option('-s, --start', 'start severs')
    .option('-c, --create', 'create apps')
    .parse(process.argv);

if (!exit.exited) {
    main();
}

/**
 * Install a before function; AOP.
 */

function before(obj, method, fn) {
    var old = obj[method];

    obj[method] = function () {
        fn.call(this);
        old.apply(this, arguments);
    };
}

/**
 * Prompt for confirmation on STDOUT/STDIN
 */

function confirm(msg, callback) {
    var rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question(msg, function (input) {
        rl.close();
        callback(/^y|yes|ok|true$/i.test(input));
    });
}

/**
 * Create application at the given directory `path`.
 *
 * @param {String} path
 */

function createApplication(app_name, apppath) {
    var wait = 5;

    console.log();
    function complete() {
        if (--wait) return;
        var prompt = launchedFromCmd() ? '>' : '$';

        console.log();
        console.log('   install dependencies:');
        console.log('     %s cd %s && npm install', prompt, apppath);
        console.log();
        console.log('   run the app:');

        if (launchedFromCmd()) {
            console.log('     %s SET DEBUG=%s:* & npm start', prompt, app_name);
        } else {
            console.log('     %s DEBUG=%s:* npm start', prompt, app_name);
        }

        console.log();
    }


    var tmps = path.join(__dirname, '..', 'templates');
    exists( tmps, apppath, copy );

    complete();

}



/**
 * Check if the given directory `path` is empty.
 *
 * @param {String} path
 * @param {Function} fn
 */

function emptyDirectory(path, fn) {
    fs.readdir(path, function(err, files){
        if (err && 'ENOENT' != err.code) throw err;
        fn(!files || !files.length);
    });
}

/**
 * Graceful exit for async STDIO
 */

function exit(code) {
    // flush output for Node.js Windows pipe bug
    // https://github.com/joyent/node/issues/6247 is just one bug example
    // https://github.com/visionmedia/mocha/issues/333 has a good discussion
    function done() {
        if (!(draining--)) _exit(code);
    }

    var draining = 0;
    var streams = [process.stdout, process.stderr];

    exit.exited = true;

    streams.forEach(function(stream){
        // submit empty write request and wait for completion
        draining += 1;
        stream.write('', done);
    });

    done();
}

/**
 * Determine if launched from cmd.exe
 */

function launchedFromCmd() {
    return process.platform === 'win32'
        && process.env._ === undefined;
}



/**
 * Main program.
 */

function main() {
    // Path
    var destinationPath = program.args.shift() || '.';

    var appPath = path.resolve(destinationPath);
    // App name
    var appName = path.basename(appPath);

    if (program.start) {

        var config = path.resolve(path.join('.', 'app'));

        binwww.Start(require(config));
    }

    if (program.create) {

        // Generate application
        emptyDirectory(destinationPath, function (empty) {
            if (empty || program.force) {
                createApplication(appName, destinationPath);
            } else {
                confirm('destination is not empty, continue? [y/N] ', function (ok) {
                    if (ok) {
                        process.stdin.destroy();
                        createApplication(appName, destinationPath);
                    } else {
                        console.error('aborting');
                        exit(1);
                    }
                });
            }
        });
    }


}

/**
 * echo str > path.
 *
 * @param {String} path
 * @param {String} str
 */

function write(path, str, mode) {
    fs.writeFileSync(path, str, { mode: mode || 0666 });
    console.log('   \x1b[36mcreate\x1b[0m : ' + path);
}

/**
 * Mkdir -p.
 *
 * @param {String} path
 * @param {Function} fn
 */

function mkdir(path, fn) {
    mkdirp(path, 0755, function(err){
        if (err) throw err;
        console.log('   \033[36mcreate\033[0m : ' + path);
        fn && fn();
    });
}




/*
 * 复制目录中的所有文件包括子目录
 * @param{ String } 需要复制的目录
 * @param{ String } 复制到指定的目录
 */
var copy = function( src, dst ){
    // 读取目录中的所有文件/目录
    fs.readdir( src, function( err, paths ){
        if( err ){
            throw err;
        }
        paths.forEach(function( path ){
            var _src = src + '/' + path,
                _dst = dst + '/' + path,
                readable, writable;
            stat( _src, function( err, st ){
                if( err ){
                    throw err;
                }
                // 判断是否为文件
                if( st.isFile() ){
                    // 创建读取流
                    readable = fs.createReadStream( _src );
                    // 创建写入流
                    writable = fs.createWriteStream( _dst );
                    // 通过管道来传输流
                    readable.pipe( writable );
                }
                // 如果是目录则递归调用自身
                else if( st.isDirectory() ){
                    exists( _src, _dst, copy );
                }
            });
        });
    });
};
// 在复制目录前需要判断该目录是否存在，不存在需要先创建目录
var exists = function( src, dst, callback ){
    fs.exists( dst, function( exists ){
        // 已存在
        if( exists ){
            callback( src, dst );
        }
        // 不存在
        else{
            fs.mkdir( dst, function(){
                callback( src, dst );
            });
        }
    });
};
