/**
 * @file 拼接字符串得到代码
 * @author ltaoo<litaowork@aliyun.com>
 */

const nativeMethods = ['onClick', 'onChange', 'onInput'];

/**
 * 得到属性
 */
function writeProps(Component) {
  const { props, type } = Component;
  const { propTypes, defaultProps } = type;

  const propsText = [];
  const propsMap = {};

  const mergedProps = Object.assign({}, propTypes, defaultProps, props);
  const keys = Object.keys(mergedProps);
  for (let i = 0, l = keys.length; i < l; i += 1) {
    const key = keys[i];
    // 忽略 children
    if (key === 'children') {
      continue;
    }
    const val = mergedProps[key];
    if (val) {
      if (typeof val === 'string') {
        propsText.push(`${key}="${mergedProps[key]}"`);
        propsMap[key] = `"${val}"`;
      } else if (typeof val === 'boolean') {
        propsText.push(`${key}=${mergedProps[key]}`);
        propsMap[key] = val;
      } else if (typeof val === 'function') {
        console.dir(val);
        if (nativeMethods.indexOf(key) > -1) {
          propsText.push(`${key}={this.${mergedProps[key].name}}`);
        }
      }
    } else {
      propsText.push(`${key}={${mergedProps[key]}}`);
    }
  }
  return {
    props: propsMap,
    text: propsText.join(' '),
  };
}

/**
 * 根据组件得到源码，简单来说只要知道 Comopnent 和属性就能拼接出代码了
 * @param {Object} obj - 包装对象
 * @param {Object} props - 组件属性
 */
export default function createSourceCode(obj, props) {
  console.log(obj, props);
}
