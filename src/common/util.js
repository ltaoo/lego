/**
 * @file 处理 instances 的一些方法
 * @author wuya
 */

export function findInstance(uuid, instances) {
  let res = null;
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    console.log(instance, uuid);
    if (instance.uuid === uuid) {
      res = instance;
      break;
    }
    if (instance.children) {
      res = findInstance(uuid, instance.children);
    }
  }
  return res;
}

/**
 * 更新属性
 * @param {*} uuid
 * @param {*} instances
 * @param {*} values
 */
export function updateProps(uuid, instances, values) {
  const {
    field,
    props,
    options,
    columns,
  } = values;
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      instance.field = Object.assign({}, instance.fieldProps, field);
      instance.props = Object.assign({}, instance.props, props);
      instance.options = options;
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

/**
 * 获取变量类型
 * @param {*} variable 
 * @return string
 */
export function getType(variable) {
  const type = Object.prototype.toString.call(variable);
  return type.slice(8, -1);
}

/**
 * 根据 defaultValue 生成 schema
 * @param {*} defaultValue 
 */
export function createSchemaByDefaultValue(defaultValue, key) {
  if (getType(defaultValue) === 'Object') {
    const properties = {};
    for (let key in defaultValue) {
      properties[key] = createSchemaByDefaultValue(defaultValue[key], key);
    }
    return {
      type: 'object',
      properties: properties,
    };
  }
  if (getType(defaultValue) === 'Array') {
    return {
      type: 'array',
      items: defaultValue.map(item => createSchemaByDefaultValue(item)),
    };
  }

  if (getType(defaultValue) === 'Function') {
    return {
      type: 'string',
    };
  }
  return {
    type: typeof defaultValue,
    title: key,
    default: defaultValue,
  };
}
