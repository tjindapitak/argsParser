require('module-alias/register');
require('@test');

global.totalTestFileRuns = 0;
global.runningTestFile = '';

var fs = require('fs');
var path = require('path');

function fromDir(startPath, filter, callback){
    if (!fs.existsSync(startPath)){
        console.log("no dir ",startPath);
        return;
    }

    var files=fs.readdirSync(startPath);
    for(var i=0;i<files.length;i++) {
        if (files[i] === 'node_modules') continue;

        var filename=path.join(startPath,files[i]);
        var stat = fs.lstatSync(filename);

        if (stat.isDirectory()){
            fromDir(filename,filter,callback); //recurse
        } else {
            if (!files[i].includes('.test.')) continue;
            else if(!filter || filename.includes(filter)) callback(filename);
        }
    };
};

const f = process.argv[2];

fromDir('./', f, function(filename){
    console.log('-- running: ',filename);

    global.runningTestFile = filename;
    global.totalTestFileRuns++;

    require('../' + filename.replace(/\\/g, '/'));

    console.log();
});

console.log();
console.log(`============ summary =============`);
console.log(`Total test files: ${global.totalTestFileRuns}`);
console.log(`Total test cases: ${global.totalTestRuns}`);
console.log(`Total test pass: ${global.totalTestPass}`);


if (global.totalTestRuns !== global.totalTestPass) {
    console.log();
    console.log(`=========== test fail ============`);

    const testFailsKeys = Object.getOwnPropertyNames(global.testFails);

    for(var i=0; i<testFailsKeys.length; i++) {
        const testFail = global.testFails[testFailsKeys[i]];

        console.log(`${i+1}. ${testFailsKeys[i]}`);

        for(var j=0; j<testFail.tests.length; j++) {
            console.log(`${testFail.tests[j]}`);
        }
        console.log();
    }
}