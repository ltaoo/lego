
/**
 * 生成页面代码
 * @param {Array} components 
 * @param {string} code 
 * @param {string} name - 页面名称
 */
export default function createPage(components, code, name) {
  console.log(components);
  const extraComponent = [];
  const methods = [];
  const constructorText = [];
  const componentText = Array.from(
    new Set(components.map(item => {
      console.log(item);
      if (item.extra) {
        extraComponent.push(item.extra);
      }
      if (item.methods) {
        methods.push(item.methods);
      }
      if (item.constructorCode) {
        constructorText.push(item.constructorCode);
      }
      return item.import;
    })),
  ).filter(item => !!item).join(',\n');

  const constructorCode = constructorText.length ? `
  constructor(props) {
    super(props);
    ${constructorText.join('/n')}
  }
  ` : '';

  const source = `import React, { Component } from 'react';
import {
  Form,
  ${componentText}
} from 'antd';

${extraComponent.join('/n')}

import styles from './index.css';

class ${name} extends Component {
  ${constructorCode}
  ${methods.join('/n')}
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
  return source;
}
