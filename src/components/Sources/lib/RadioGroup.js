import { Radio } from 'antd';

import layout from './fieldLayout';

const { Group: RadioGroup } = Radio;

export default {
  Component: RadioGroup,
  label: 'RadioGroup',
  import: 'Radio',
  extra: 'const { Group: RadioGroup } = Radio;',
  // 表单用字段
  isField: true,
  fieldProps: {
    title: '特殊资源',
    label: 'resource',
    rules: [],
    initialValue: 1,
    ...layout,
  },
  props: {
    options: [
      {
        label: '线上品牌赞助',
        value: 0,
      },
      {
        label: '线下场地免费',
        value: 1,
      },
    ],
  },
};
