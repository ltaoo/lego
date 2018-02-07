import { Checkbox } from 'antd';

import layout from './fieldLayout';

const { Group: CheckboxGroup } = Checkbox;

const options = [
  {
    label: '美食线上活动',
    value: 0,
  },
  {
    label: '地推活动',
    value: 1,
  },
  {
    label: '线下主体活动',
    value: 2,
  },
  {
    label: '单纯品牌曝光',
    value: 3,
  },
];
function onChange() {}

export default function (params = {}) {
  const { uuid } = params;
  return {
    Component: CheckboxGroup,
    label: 'CheckboxGroup',
    import: 'Checkbox',
    extra: 'const { CheckboxGroup } = Checkbox;',
    stateCode: `options${uuid}: ${JSON.stringify(options)}`,
    renderCode: `options${uuid}`,
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '活动性质',
      label: 'property',
      rules: [],
      initialValue: [2],
      ...layout,
    },
    props: {
      options,
      optionsVal: `options${uuid}`,
      onChange: onChange,
    },
  };
};
