const fs = require('fs');
const Task = require('shell-task');
let chokidar = require('chokidar');
const colors = require('colors');
const repl = require('repl');

let fileLists = [], replServer = null;

module.exports = function WeClone(obj) {
    this.customer = obj.customer;
    this.path = obj.path.replace(/^((\/)|(\.\/))|(\/)$/, '').replace(/^((\/)|(\.\/))|(\/)$/, '') || '';
    this.rules =  obj.rules ? new RegExp('((\.' + obj.rules.join(')|(\.') + '))$') : /((\.js)|(\.json)|(\.wxss)|(\.wxml)|(\.png))$/;
    if (obj.replaceFiles) {
        let temp = [];
        for (let x in obj.replaceFiles) {
            x = x.replace(/^((\/)|(\.\/))|(\/)$/, '').replace(/^((\/)|(\.\/))|(\/)$/, '')
            temp.push([x, obj.replaceFiles[x]])
        }
        this.replaceFiles = new Map(temp);
    }
    let _this = this;
    this.run = () => {
        let task = new Task('git status')
        console.log('Start Watch...'.green);
        let fwatch = fs.watch(_this.path, { recursive: true, encoding: '' }, (eventType, filename) => {
            if (filename) {
                if (_this.rules.test(filename) && !~fileLists.indexOf(filename)) {
                    console.log(`\n${new Date()} file change: =====`.red)
                    console.log(`${filename}`.red);
                    fileLists.push(filename)
                    console.log('All Changes: ' + fileLists)
                    fs.writeFile('file-changed.txt', fileLists.join(','), (err) => {
                        if (err) throw err;
                        console.log('file-changed.txt has been saved!'.red);
                        replServer.displayPrompt();
                    });
                }
            }
        });
        task.then(`touch file-changed.txt`)
            .run(function (err, next) {
                if (err) {
                    // continue the flow
                } else {
                    let cwatch = chokidar.watch('./file-changed.txt', {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
                        // console.log(`${event}`.blue, path);
                        if (event === 'unlink') {
                            console.log('Watch closed'.red);
                            fwatch.close();
                            cwatch.close();
                        }
                    });
                    console.log('file-changed.txt done!'.rainbow);

                    replServer = repl.start({ prompt: 'build ? (.y/.n) : ' });
                    replServer.defineCommand('y', {
                        help: 'memeda',
                        action(name) {
                            fs.readFile('file-changed.txt', {encoding: 'utf8'}, (err, data) => {
                                if (err) throw err;
                                // console.log(data);
                                fileLists = data.split(',');
                                for (let val in _this.customer) {
                                    fs.stat(__dirname + '/' + val, (err, stat) => {
                                        if (!stat || !stat.isDirectory()) {
                                            task.then(`mkdir ${val}`)
                                                .then(`cp -r ./${_this.path}/ ./${val}`)
                                                .run(function (err, next) {
                                                    if (err) {
                                                        // continue the flow
                                                    } else {
                                                        console.log('done!')
                                                    }
                                                })
                                        } else {
                                            for (let v of fileLists) {
                                                fs.stat(`${__dirname}/${_this.path}/${v}`, (err, stat) => {
                                                    if (!stat) {
                                                        task.then(`rm -r -f ${__dirname}/${val}/${v}`)
                                                            .run(function (err, next) {
                                                                if (err) {
                                                                    // continue the flow
                                                                } else {
                                                                    console.log('done!'.rainbow)
                                                                }
                                                            })
                                                    } else {
                                                        task.then(`cp ./${_this.path}/${v} ./${val}/${v}`)
                                                            .then('sleep 3000')
                                                            .then((next) => {
                                                                if (_this.replaceFiles && _this.replaceFiles.has(v)) {
                                                                    fs.readFile(`./${val}/${v}`, {encoding: 'utf8'}, (err, data) => {
                                                                        if (err) throw err;
                                                                        let preReplace = _this.replaceFiles.get(v).preReplace;
                                                                        let replace = _this.replaceFiles.get(v).replace;
                                                                        let replaces = replace.match(/\{\{+\S+\}\}/g);
                                                                        for (let value of replaces) {
                                                                          value = value.substring(2, value.length - 2);
                                                                          replace = replace.replace(/(\{\{+\S+\}\}){1}/, _this.customer[val][value])
                                                                        }
                                                                        let writeData = data.replace(preReplace, replace);
                                                                        fs.writeFile(`./${val}/${v}`, writeData, (err) => {
                                                                            if (err) throw err;
                                                                            console.log('The file has been Written!'.rainbow);
                                                                        });
                                                                    })
                                                                }
                                                                setTimeout(next, 3000)
                                                            })
                                                            .run(function (err, next) {
                                                                if (err) {
                                                                    // continue the flow
                                                                } else {
                                                                }
                                                            })
                                                    }
                                                })
                                            }
                                        }
                                    })
                                }
                                task.then(`rm file-changed.txt`)
                                    .run(function (err, next) {
                                        if (err) {
                                            // continue the flow
                                        } else {
                                            // console.log('done!')
                                        }
                                    })
                            });
                            this.close();
                        }
                    });
                }
            })
    }
}
