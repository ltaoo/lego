/**
 * 递归更新属性
 * @param {*} uuid 
 * @param {*} instances 
 * @param {*} fieldProps 
 * @param {*} props 
 */
export function updateProps(uuid, instances, fieldProps, props) {
    console.log(uuid, instances, fieldProps, props);
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      instance.fieldProps = Object.assign({}, instance.fieldProps, fieldProps);
      instance.props = Object.assign({}, instance.props, props);
      break;
    }
    if (instance.children && instance.children.length) {
      updateProps(uuid, instance.children, fieldProps, props);
    }
  }
}

