import { Input } from 'antd';

import layout from './fieldLayout';
import { getSchema, fieldSchema } from './commonSchema';

export default function getInputInstance() {
  return {
    Component: Input,
    label: 'Input',
    import: 'Input',
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '活动名称',
      label: 'name',
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    props: {},
    // 编辑属性表单用的 schema
    schema: {
      ...getSchema(
        fieldSchema({
          placeholder: '请输入活动名称',
          title: '活动名称',
          label: 'name',
        }),
        {
          labelCol: {
            type: 'integer',
            title: 'labelCol',
            default: 2,
          },
          wrapperCol: {
            type: 'integer',
            title: 'wrapperCol',
            default: 22,
          },
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
        },
      ),
    },
  };
}
