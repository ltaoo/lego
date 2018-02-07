import { Checkbox } from 'antd';

import layout from './fieldLayout';

const { Group: CheckboxGroup } = Checkbox;

export default {
  Component: CheckboxGroup,
  label: 'CheckboxGroup',
  import: 'Checkbox',
  extra: 'const { CheckboxGroup } = Checkbox;',
  // 表单用字段
  isField: true,
  fieldProps: {
    title: '活动名称',
    label: 'name',
    rules: [],
    initialValue: [2],
    ...layout,
  },
  props: {
    placeholder: '请输入活动名称',
    options: [
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
    ],
  },
};
