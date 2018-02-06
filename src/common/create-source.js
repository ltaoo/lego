/**
 * @file 拼接字符串得到代码
 * @author wuya
 */

const nativeMethods = ['onClick', 'onChange', 'onInput'];
const IGNORE_ITEMS = ['children'];

/**
 * 得到属性文本，如 { key: 0, type: 'primary' } 则会返回 'key={0} type="primary"'
 * @param {Object} props - 组件属性
 * @return {string}
 */
function createPropsText(props) {
  const propsText = [];
  const propsMap = {};

  const keys = Object.keys(props);
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const key = keys[i];
    // 忽略
    if (IGNORE_ITEMS.indexOf(key) > -1) {
      continue;
    }
    // 只处理简单类型，string、boolean、function
    const val = props[key];
    if (val) {
      if (typeof val === 'string') {
        propsText.push(`${key}="${props[key]}"`);
        propsMap[key] = `"${val}"`;
      } else if (typeof val === 'boolean') {
        propsText.push(`${key}=${props[key]}`);
        propsMap[key] = val;
      } else if (typeof val === 'function') {
        console.dir(val);
        if (nativeMethods.indexOf(key) > -1) {
          propsText.push(`${key}={this.${props[key].name}}`);
        }
      }
    } else {
      propsText.push(`${key}={${props[key]}}`);
    }
  }
  return propsText.join(' ');
}

/**
 * 
 * @param {Antd Component} Component 
 * @param {Object} props 
 */
function mergeProps(Component, props) {
  const { propTypes, defaultProps } = Component;
  return Object.assign({}, propTypes, defaultProps, props);
}

/**
 * 标签与属性生成代码
 * @param {string} Tag 
 * @param {Object} props 
 */
function createCodeWithProps(Tag, props) {
  const propsText = createPropsText(props);
  return `<${Tag} ${propsText}></${Tag}>`;
}

/**
 * 根据实例对象拼接字符串代码
 * @param {Array} instances - 实例对象数组
 */
export default function createSourceCode(instances) {
  let code = '';
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { Component, label, props } = instance;
    const mergedProps = mergeProps(Component, props);
    code += createCodeWithProps(label, mergedProps);
  }
  return code;
}
