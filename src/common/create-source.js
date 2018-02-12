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
      if (key === 'options') {
        propsText.push(`options={${props[key].toString()}}`);
        continue;
      }
      if (typeof val === 'string') {
        propsText.push(`${key}="${props[key]}"`);
      } else if (typeof val === 'boolean') {
        propsText.push(`${key}={${props[key]}}`);
      } else if (typeof val === 'function') {
        if (nativeMethods.indexOf(key) > -1) {
          propsText.push(`${key}={this.${props[key].name}}`);
        }
      } else if (typeof val === 'object') {
        propsText.push(`${key}={${JSON.stringify(props[key])}}`);
      } else {
        propsText.push(`${key}={${props[key]}}`);
      }
    } else {
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
  const { propTypes } = Component;
  // 移除 defaultProps
  return Object.assign({}, propTypes, props);
}

/**
 * 标签与属性生成代码
 * @param {Object} instance 
 * @param {Object} props 
 * @param {boolean} isField - 是否是表单
 */
function createCodeWithProps(instance, props, isField, fieldProps) {
  const { label: Tag, children } = instance;
  // 属性文本
  const propsText = createPropsText(props);
  let code = `<${Tag} ${propsText}>`;
  // 按钮的文本
  if (props.children && typeof props.children === 'string') {
    code += props.children;
  } else if (children && children.length > 0) {
    code += createSourceCode(children);
  }
  // Select 需要处理 Option
  if (Tag === 'Select') {
    const { options } = instance;
    const optionCode = options.map(option => `<Option value={${option.value}}>${option.label}</Option>`).join('');
    code += optionCode;
  }
  code += `</${Tag}>`;
  if (isField) {
    const { title, label, rules, initialValue, labelCol, wrapperCol } = fieldProps;
    const rulesText = rules ? `rules: ${JSON.stringify(rules)}` : '';
    const initialValueText = initialValue !== undefined ? `initialValue: ${JSON.stringify(initialValue)}` : '';
    const labelColText = labelCol ? ` labelCol={${JSON.stringify(labelCol)}}` : '';
    const wrapperColText = wrapperCol ? ` wrapperCol={${JSON.stringify(wrapperCol)}}` : '';

    const optionsText = [rulesText, initialValueText].filter(item => !!item).join(',');
    const decoratorText = label
      ? `{getFieldDecorator('${label}', {
        ${optionsText}
      })(
        ${code}
      )}`
      : code;
    code = `<Form.Item label="${title}"${labelColText}${wrapperColText}>
          ${decoratorText}
        </Form.Item>`;
  }
  return code;
}

/**
 * 根据实例对象拼接字符串代码
 * @param {Array} instances - 实例对象数组
 */
export default function createSourceCode(instances) {
  let code = '';
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { Component, props } = instance;
    const mergedProps = mergeProps(Component, props);
    code += createCodeWithProps(instance, mergedProps, instance.isField, instance.fieldProps);
  }
  return code;
}
