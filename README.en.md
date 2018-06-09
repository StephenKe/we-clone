# Language
  [中文](https://github.com/StephenKe/we-clone/tree/master)
# we-clone
A tool for deploying multiple weapp version.
# Description
Smart clone.Generated file-changed.txt(recording all file chenges while develop) on __dirname after runned.
Terminal show:
```
build ? (.y/.n)
```
Terminal input .y to build files and delete file-changed.txt
# Install
`$ npm install we-clone`
# Usage
```
let WeClone = require('we-clone')

new WeClone({
  // Generated customer1&customer2&customer3 directory and set its common attribute & different value
  // e.g: id&host. It can customize by yourself
  customer: {
    'customer1': {id: 1, host: 'https://test1.com'},
    'customer2': {id: 15, host: 'https://test2.com'},
    'customer3': {id: 64, host: 'https://test3.com'}
  },
  // Watching path.  Default: ''
  path: './test',
  // Optional.Watching file type. Default: ['js', 'json', 'wxss', 'wxml', 'png']
  rules: [],
  // Optional.Customize clone path. e.g: ./test/app.js & ./test/config.js
  // preReplace: Contents needs to replace.
  // replace: Contents after replaced.Use '{{}}' wrap fields(relate to customer)
  replaceFiles: {
    'app.js': {
      preReplace: 'CONSTANT.ID = 1',
      replace: 'CONSTANT.ID = {{id}}'
    },
    'config.js': {
      preReplace: 'https://cupboard-admin.adonging.com',
      replace: '{{host}}'
    }
  }
}).run()
```
