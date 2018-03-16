import { Input } from 'antd';

import layout from './fieldLayout';

/**
 * 插入默认值
 * @param {*} schema 
 * @param {*} defaultValue 
 */
function insertDefaultValue(schema, defaultValue) {

}

/**
 * 获取变量类型
 * @param {*} variable 
 * @return string
 */
function getType(variable) {
  const type = Object.prototype.toString.call(variable);
  return type.slice(8, -1);
}

/**
 * 根据 defaultValue 生成 schema
 * @param {*} defaultValue 
 */
function createSchemaByDefaultValue(defaultValue, key) {
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
  return {
    type: typeof defaultValue,
    title: key,
    default: defaultValue,
  };
}

const defaultValue = {
  // 表单用字段
  field: {
    label: '活动名称',
    id: 'name',
    rules: [{
      required: true,
      messsage: '请填写活动名称',
    }],
    ...layout,
  },
  props: {
    placeholder: '请输入活动名称',
  },
};

const schema = {
  type: 'object',
  properties: {
    // props
    props: {
      type: 'object',
      properties: {
        placeholder: {
          type: 'string',
          title: 'placeholder'
        },
      },
    },
    // 表单字段相关
    field: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          default: 'name',
        },
        label: {
          type: 'string',
          default: '活动名称',
        },
        labelCol: {
          type: 'object',
          properties: {
            span: {
              type: 'integer',
              title: 'labelCol',
              default: 2,
            },
          },
        },
        wrapperCol: {
          type: 'object',
          properties: {
            span: {
              type: 'integer',
              title: 'wrapperCol',
              default: 22,
            },
          },
        },
        // 校验规则
        rules: {
          type: 'array',
          items: [
            {
              type: 'object',
              properties: {
                required: {
                  type: 'boolean',
                  title: '是否必填',
                  default: true,
                },
                message: {
                  type: 'string',
                  title: '错误提示',
                  default: '请填写'
                },
              },
            },
            {
              type: 'object',
              properties: {
                max: {
                  type: 'integer',
                  title: '最大长度',
                },
                message: {
                  type: 'string',
                  title: '错误提示',
                },
              },
            },
            {
              type: 'object',
              properties: {
                min: {
                  type: 'integer',
                  title: '最小长度',
                },
                message: {
                  type: 'string',
                  title: '错误提示',
                },
              },
            },
          ],
        },
      }
    },
  },
};

export default function getInputInstance() {
  return {
    Component: Input,
    label: 'Input',
    import: 'Input',
    ...defaultValue,
    schema: createSchemaByDefaultValue(defaultValue),
  };
}
