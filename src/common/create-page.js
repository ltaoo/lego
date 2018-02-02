
/**
 * 生成页面代码
 * @param {Array} components 
 * @param {string} code 
 * @param {string} name - 页面名称
 */
export default function createPage(components, code, name) {
  let extraComponent = [];
  const componentText = Array.from(
    new Set(components.map(item => {
      if (item.extra) {
        extraComponent.push(item.extra);
      }
      return item.import;
    })),
  ).filter(item => !!item).join(',\n');
  const source = `import React, { Component } from 'react';
import {
  Form,
  ${componentText}
} from 'antd';

${extraComponent.join('/n')}

import styles from './index.css';

class ${name} extends Component {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
  }
  handleClick () {
    const { validateFieldsAndScroll } = this.props.form;
    validateFieldsAndScroll([], function(err, values) {
      if (err) {
        return;
      }
      console.log(values);
      alert(JSON.stringify(values));
    });
  }
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
