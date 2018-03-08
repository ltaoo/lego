import { Input } from 'antd';

import layout from './fieldLayout';

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
      rules: [],
      ...layout,
    },
    props: {
      placeholder: '请输入活动名称',
    },
    schema: {
    },
  };
}
