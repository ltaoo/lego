
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
  let importComponents = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { import: importText, children } = instance;
    if (importText) {
      importComponents.push(importText);
    }
    if (children && children.length) {
      importComponents = importComponents.concat(getComponentCode(children));
    }
  }
  // 去重
  return deduplication(importComponents);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getExtraComponentCode(instances) {
  let extraImportComponents = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { extra: importText, children } = instance;
    if (importText) {
      extraImportComponents.push(importText);
    }
    if (children && children.length) {
      extraImportComponents = extraImportComponents.concat(getComponentCode(children));
    }
  }
  // 去重
  return deduplication(extraImportComponents);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getMethods(instances) {
  let extraImportComponents = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { methods, children } = instance;
    if (methods) {
      extraImportComponents.push(methods);
    }
    if (children && children.length) {
      extraImportComponents = extraImportComponents.concat(getComponentCode(children));
    }
  }
  // 去重
  return deduplication(extraImportComponents);
}
/**
 * 拼接 const { xx } = Input|Form|DatePicker  中的 xx 部分
 * @param {Array} instances - 实例对象
 * @return {Array}
 */
function getConstructorText(instances) {
  let extraImportComponents = [];

  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { constructorCode, children } = instance;
    if (constructorCode) {
      extraImportComponents.push(constructorCode);
    }
    if (children && children.length) {
      extraImportComponents = extraImportComponents.concat(getComponentCode(children));
    }
  }
  // 去重
  return deduplication(extraImportComponents);
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
import styles from './index.css';

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
