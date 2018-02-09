/**
 * 递归更新属性
 * @param {*} uuid
 * @param {*} instances
 * @param {*} fieldProps
 * @param {*} props
 */
export function updateProps(uuid, instances, fieldProps, props, options) {
  // todo: 后面的参数优化为一个
  console.log(uuid, instances, fieldProps, props, options);
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      instance.fieldProps = Object.assign({}, instance.fieldProps, fieldProps);
      instance.props = Object.assign({}, instance.props, props);
      instance.options = options;
      break;
    }
    if (instance.children && instance.children.length) {
      updateProps(uuid, instance.children, fieldProps, props, options);
    }
  }
}

/**
 * 移除指定组件
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
