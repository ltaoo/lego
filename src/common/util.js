/**
 * @file 处理 instances 的一些方法
 * @author wuya
 */

/**
 * 更新属性
 * @param {*} uuid
 * @param {*} instances
 * @param {*} values
 */
export function updateProps(uuid, instances, values) {
  const {
    fieldProps,
    props,
    options,
    columns,
    rules,
  } = values;
  console.log(values);
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      instance.fieldProps = Object.assign({}, instance.fieldProps, fieldProps);
      instance.props = Object.assign({}, instance.props, props);
      instance.options = options;
      instance.rules = rules;
      instance.columns = columns;
      break;
    }
    if (instance.children && instance.children.length) {
      updateProps(uuid, instance.children, values);
    }
  }
}

/**
 * 移除指定组件
 * @param {number} uuid - 组件 id
 * @param {Array|Object} instances
 */
export function removeComponent(uuid, instances) {
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      const index = instances.indexOf(instance);
      instances.splice(index, 1);
      break;
    }
    if (instance.children && instance.children.length) {
      removeComponent(uuid, instance.children);
    }
  }
}
