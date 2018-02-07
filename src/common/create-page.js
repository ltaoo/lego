
/** 
 * @file 生成页面对应的代码
 * @author wuya
 */

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
function getComponentCode(instances) {
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
 * 生成页面代码
 * @param {Array} instances - 实例对象数组
 * @param {string} code 
 * @param {string} name - 页面名称
 */
export default function createPageCode(instances, code, name) {
  // todo 优化
  const componentCode = getComponentCode(instances).join(',\n\t');
  const extraComponentCode = getExtraComponentCode(instances).join('\n\t');
  const methodsCode = getMethods(instances).join('\n');
  const constructorText = getConstructorText(instances).join('\n\t\t');

  const constructorCode = constructorText ? `constructor(props) {
    super(props);
    ${constructorText}
  }
  ` : '';

  return `import React, { Component } from 'react';
import {
  Form,
  ${componentCode}
} from 'antd';
import styles from './IndexPage.css';

${extraComponentCode}

class ${name} extends Component {
  ${constructorCode}
  ${methodsCode}
  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <div className={styles.container}>
        ${code}
      </div>
    );
  }
}

export default Form.create()(${name});`;
}
