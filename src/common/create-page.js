
/** 
 * @file 生成页面对应的代码
 * @author wuya
 */

const mixPropsAry = ['dataSource', 'renderItem'];
/** 
 * 去重
 */
function deduplication(ary) {
  return Array.from(new Set(ary));
}
/**
 * 拼接 import { xxx } from 'antd'; 中的 xxx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getComponentCode(instances = []) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { import: importText, children } = instance;
    if (importText) {
      ary.push(importText);
    }
    if (children && children.length) {
      ary = ary.concat(getComponentCode(children));
    }
  }
  // 去重
  return deduplication(ary);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getExtraComponentCode(instances) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { extra: importText, children } = instance;
    if (importText) {
      ary.push(importText);
    }
    if (children && children.length) {
      ary = ary.concat(getExtraComponentCode(children));
    }
  }
  // 去重
  return deduplication(ary);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getMethods(instances) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { methods, children } = instance;
    console.log('methods', methods);
    if (methods) {
      ary.push(methods);
    }
    if (children && children.length) {
      ary = ary.concat(getMethods(children));
    }
  }
  // 去重
  return deduplication(ary);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getConstructorText(instances) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { constructorCode, children } = instance;
    if (constructorCode) {
      ary.push(constructorCode);
    }
    if (children && children.length) {
      ary = ary.concat(getConstructorText(children));
    }
  }
  // 去重
  return deduplication(ary);
}
/**
 * 拼接 this.state = { xx } 中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getStateText(instances) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const {
      uuid,
      stateCode,
      columns,
      dataSource,
      mergedProps,
    } = instance;
    if (stateCode) {
      const {
        options,
      } = mergedProps;
      if (mergedProps) {
        const keys = Object.keys(mergedProps);
        for (let j = 0, len = keys.length; j < len; j += 1) {
          const key = keys[j];
          const val = mergedProps[key];
          if (typeof val !== 'function') {
            ary.push(key + uuid + ':' + JSON.stringify(mergedProps[key]));
          }
        }
        continue;
      }
      if (options) {
        ary.push(stateCode + JSON.stringify(options));
      } else if (columns) {
        if (Array.isArray(stateCode)) {
          ary.push(stateCode[0] + JSON.stringify(columns));
          ary.push(stateCode[1] + JSON.stringify(dataSource));
        } else {
          ary.push(stateCode + JSON.stringify(columns));
        }
      } else if (dataSource && !columns) {
        ary.push(stateCode + JSON.stringify(columns));
      } else {
        ary.push(stateCode);
      }
    }
  }
  // 去重
  return deduplication(ary);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getRenderCode(instances) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { renderCode } = instance;
    if (renderCode) {
      ary.push(renderCode);
    }
  }
  // 去重
  return deduplication(ary);
}
function getDidMountCode(instances) {
  let ary = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { didMount } = instance;
    if (didMount) {
      ary.push(didMount);
    }
  }
  // 去重
  return deduplication(ary);
}
/**
 * 生成页面代码
 * @param {Array} instances - 实例对象数组
 * @param {string} code 
 * @param {string} name - 页面名称
 */
export default function createPageCode(instances = [], code, name) {
  // todo 优化
  const componentCode = getComponentCode(instances).join(',');
  const extraComponentCode = getExtraComponentCode(instances).join('\n');
  const methodsCode = getMethods(instances).join('\n');
  const constructorText = getConstructorText(instances).join('');
  const stateCode = getStateText(instances).join(',');
  const renderCode = getRenderCode(instances).join(',');
  const didMountCode = getDidMountCode(instances).join();

  const constructorCode = (constructorText || stateCode) ? `constructor(props) {
    super(props);
    ${constructorText}
    this.state = {
      ${stateCode}
    };}` : '';

  return `import React, { Component } from 'react';
import {
  Form,
  ${componentCode}
} from 'antd';

${extraComponentCode}

class ${name} extends Component {
  ${constructorCode}
  componentDidMount() {
    ${didMountCode}
  }
  ${methodsCode}
  render() {
    const { form } = this.props;
    const {
      ${renderCode}
     } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div>
        ${code}
      </div>
    );
  }
}

export default Form.create()(${name});`;
}
