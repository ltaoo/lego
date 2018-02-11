import { Radio } from 'antd';

import layout from './fieldLayout';

const { Group: RadioGroup } = Radio;

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
  return {
    Component: RadioGroup,
    label: 'RadioGroup',
    import: 'Radio',
    extra: 'const { Group: RadioGroup } = Radio;',
    stateCode: `options${uuid}:`,
    renderCode: `options${uuid}`,
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '特殊资源',
      label: 'resource',
      rules: [],
      initialValue: 1,
      ...layout,
    },
    options,
    props: {
      options: `options${uuid}`,
    },
  };
}
