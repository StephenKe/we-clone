# we-clone
一个为方案提供商部署多客户版本小程序的工具
# Description
高性能按需clone，运行后终端显示
```
build ? (.y/.n)
```
终端输入  .y  确认开始生成文件
# Install
`$ npm install we-clone`
# Usage
```
let WeClone = require('we-clone')

new WeClone({
  // 在当前路径下生成 customer1&customer2&customer3 目录并配置不同客户的公共字段
  // 实例为id&host，可自定义
  customer: {
    'customer1': {id: 1, host: 'https://test1.com'},
    'customer2': {id: 15, host: 'https://test2.com'},
    'customer3': {id: 64, host: 'https://test3.com'}
  },
  // 监测目录，默认为''
  path: './test',
  // 可选项。监测的文件类型，默认为['js', 'json', 'wxss', 'wxml', 'png']
  rules: [],
  // 可选项，配置自定义clone的文件路径，实例为./test/app.js & ./test/config.js
  // preReplace: 需要替换的内容
  // replace: 替换后的内容，用'{{}}'包裹替换字段，字段名与customer对应
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
