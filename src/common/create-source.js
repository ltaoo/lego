/**
 * @file 拼接字符串得到代码
 * @author wuya
 */

const nativeMethods = ['onClick', 'onChange', 'onInput', 'onOk', 'onCancel'];
// 忽略项
const IGNORE_ITEMS = ['children'];
const MERGED_PROPS = ['options', 'dataSource', 'columns', 'visible', 'renderItem'];

const HANDLER = {
  string(key, val) {
    return `${key}="${val}"`;
  },
  number(key, val) {
    return `${key}={${val}}`;
  },
  boolean(key, val) {
    return `${key}={${val}}`;
  },
  function(key, val) {
    if (nativeMethods.indexOf(key) > -1) {
      return `${key}={this.${val.name}}`;
    }
    return '';
  },
  object(key, val) {
    return `${key}={${JSON.stringify(val)}}`;
  },
  default(key, val) {
    return `${key}={${val}}`;
  },
}

/**
 * 得到属性文本，如 { key: 0, type: 'primary' } 则会返回 'key={0} type="primary"'
 * @param {Object} props - 组件属性
 * @return {string}
 */
function createPropsText(props) {
  const propsText = [];

  const keys = Object.keys(props);
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const key = keys[i];
    // 忽略
    if (IGNORE_ITEMS.indexOf(key) > -1) {
      continue;
    }
    // 只处理简单类型，string、boolean、function
    const val = props[key];
    if (val !== undefined) {
      // 一些特殊的属性
      if (MERGED_PROPS.indexOf(key) > -1) {
        propsText.push(`${key}={${val}}`);
        continue;
      }
      const type = typeof val || 'default';
      console.log('type', type);
      const text = HANDLER[type](key, val);
      propsText.push(text);
    }
  }
  return propsText.join(' ');
}

/**
 * 将 propTypes 上的属性拿到，就知道这个组件需要哪些属性了
 * @param {Antd Component} Component 
 * @param {Object} props 
 * @return {Object}
 */
function mergeProps(Component, props) {
  const { propTypes } = Component;
  // 移除 defaultProps
  return Object.assign({}, propTypes, props);
}

/**
 * 标签与属性生成代码
 * @param {Object} instance 
 * @param {Object} props 
 */
function createCodeWithProps(instance, props) {
  const { label: Tag, children, field } = instance;
  // 属性文本
  const propsText = createPropsText(props);
  // 最基本的情况
  let code = `<${Tag} ${propsText}>`;
  if (props.children && typeof props.children === 'string') {
    code += props.children;
  } else if (children && children.length > 0) {
    code += createSourceCode(children);
  }
  // Select 需要处理 Option
  if (Tag === 'Select') {
    const { mergedProps } = instance;
    const {
      options,
    } = mergedProps;
    const optionCode = options.map(option => `<Option value={${option.value}}>${option.label}</Option>`).join('');
    code += optionCode;
  }
  code += `</${Tag}>`;
  if (field) {
    const { label, id, rules, initialValue, labelCol, wrapperCol } = field;
    const rulesText = rules ? `rules: ${JSON.stringify(rules)}` : '';
    const initialValueText = initialValue !== undefined ? `initialValue: ${JSON.stringify(initialValue)}` : '';
    const labelColText = labelCol ? ` labelCol={${JSON.stringify(labelCol)}}` : '';
    const wrapperColText = wrapperCol ? ` wrapperCol={${JSON.stringify(wrapperCol)}}` : '';

    const optionsText = [rulesText, initialValueText].filter(item => !!item).join(',');
    const decoratorText = id
      ? `{getFieldDecorator('${id}', {
        ${optionsText}
      })(
        ${code}
      )}`
      : code;
    code = `<Form.Item label="${label}"${labelColText}${wrapperColText}>
          ${decoratorText}
        </Form.Item>`;
  }
  return code;
}

function createSingleComponentCode(instance) {
  const { Component, props, mergedProps } = instance;
  const newProps = mergeProps(Component, props, mergedProps);
  return createCodeWithProps(instance, newProps);
}
/**
 * 根据实例对象拼接字符串代码
 * @param {Array} instances - 实例对象数组
 * @return {string}
 */
export default function createSourceCode(instances = []) {
  let code = '';
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    code += createSingleComponentCode(instance);
  }
  return code;
}
