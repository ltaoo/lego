import { Radio } from 'antd';

import layout from './fieldLayout';
import { getSchema, fieldSchema } from './commonSchema';

const { Group: RadioGroup } = Radio;

// 希望这个也是可以填写的
const options = [
  {
    label: '线上品牌赞助',
    value: 0,
  },
  {
    label: '线下场地免费',
    value: 1,
  },
];

export default function getRadioInstance(params = {}) {
  const { uuid } = params;
  const schema = {
    size: {
      type: 'string',
      enum: ['default', 'large', 'small'],
      enumNames: ['default', 'large', 'small'],
      default: 'default',
    },
    optionsName: {
      type: 'string',
      default: `options${uuid}`,
    },
    options: {
      type: 'array',
      default: options,
      items: {
        type: 'object',
        properties: {
          label: {
            type: 'string',
          },
          value: {
            type: 'integer',
          },
        },
      },
    },
  };
  return {
    Component: RadioGroup,
    label: 'RadioGroup',
    import: 'Radio',
    extra: 'const { Group: RadioGroup } = Radio;',
    stateCode: `options${uuid}:`,
    renderCode: `options${uuid}`,
    // 表单用字段
    field: {
      label: '特殊资源',
      id: 'resource',
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    mergedProps: {
      options,
    },
    props: {
      options: `options${uuid}`,
    },
  };
}
