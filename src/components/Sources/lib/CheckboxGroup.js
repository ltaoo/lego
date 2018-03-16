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
    extra: 'const { Group: CheckboxGroup } = Checkbox;',
    stateCode: `options${uuid}:`,
    renderCode: `options${uuid}`,
    constructorCode: 'this.handleClick = this.handleClick.bind(this);',
    methods: `
    onChange (val) {
      console.log(val);
    }
    `,
    // 表单用字段
    field: {
      label: '活动性质',
      id: 'property',
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    // 实际的 options
    mergedProps: {
      options,
    },
    props: {
      // 只是文字
      options: `options${uuid}`,
      onChange: onChange,
    },
  };
};
