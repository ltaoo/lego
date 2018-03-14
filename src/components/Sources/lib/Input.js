import { Input } from 'antd';

import layout from './fieldLayout';

export default function getInputInstance() {
  return {
    Component: Input,
    label: 'Input',
    import: 'Input',
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
    schema: {
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
    },
  };
}
