import { Select } from 'antd';

import layout from './fieldLayout';

export default function getSelectInstance() {
  return {
    Component: Select,
    label: 'Select',
    import: 'Select',
    extra: 'const { Option } = Select;',
    constructorCode: 'this.onChange = this.onChange.bind(this);',
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '活动区域',
      label: 'region',
      rules: [],
      initialValue: 0,
      ...layout,
    },
    methods: `
      onChange (val) {
        alert(val);
      }
    `,
    options: [{ label: '区域一', value: 0 }, { label: '区域二', value: 1 }],
    props: {
      style: { width: 200 },
      placeholder: '请选择值',
    },
  };
}
