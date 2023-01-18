/*
 * @Author: 时不待我 790002517@qq.com
 * @Date: 2022-09-18 18:13:26
 * @LastEditors: 时不待我 790002517@qq.com
 * @LastEditTime: 2022-09-18 18:13:35
 */
const fs = require('fs')

const path = require('path')

// 解决 node_modules 修改源码，导致重新装包而要手动替换源码的重复操作。

// 将 scripts/node_modules 内的文件 覆盖 真正的 node_modules

const REAL_NODE_MODULES = path.resolve('./node_modules') // 旧node_modules

const MY_NODE_MODULES = path.resolve('./scripts/new_node_modules') // 新node_modules

copy(MY_NODE_MODULES, REAL_NODE_MODULES)

/**

*复制目录中的所有文件包括子目录

*@param{string}需要复制的目录、文件

*@param{string}复制到指定的目录、文件

*@param{function}每次复制前，都会经过一次filterFn，若返回true，则复制。

*/

function copy (origin, target, filterFn = () => true) {
  if (fs.statSync(origin).isDirectory()) {
    // 来源是个文件夹，那目标也整一个文件夹

    if (!fs.existsSync(target)) {
      fs.mkdirSync(target)
    }

    fs.readdirSync(origin).forEach(originName => {
      const originFilePath = path.resolve(origin, originName)

      const targetFilePath = path.resolve(target, originName)

      copy(originFilePath, targetFilePath, filterFn)
    })
  } else if (filterFn(origin, target)) {
    fs.copyFileSync(origin, target)
  }
}