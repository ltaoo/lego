// 表单字段的 schema
export function fieldSchema (data) {
  const res = {
    placeholder: {
      type: 'string',
      title: 'placeholder',
    },
    title: {
      type: 'string',
      title: 'title',
    },
    label: {
      type: 'string',
      title: 'label',
    },
    initialValue: {
      type: 'string',
      title: '初始值',
    },
  };
  for (let key in data) {
    if (res[key] !== undefined) {
      res[key].default = data[key];
    }
  }
  return res;
};

// 布局组件的 schema
export const layoutSchema = {
  labelCol: {
    type: 'integer',
    title: 'labelCol',
  },
  wrapperCol: {
    type: 'integer',
    title: 'wrapperCol',
  },
};

export const optionsSchema = {
  optionsName: {
    type: 'string',
    title: 'optionsName',
  },
};

/**
 * 获取 schema
 * @param {*} args 
 * @return {Object}
 */
export function getSchema(...args) {
  let schema = {};
  for (let i = 0, l = args.length; i < l; i += 1) {
    const item = args[i];
    schema = {
      ...schema,
      ...item,
    };
  }
  return {
    type: 'object',
    properties: {
      ...schema,
    },
  };
}
