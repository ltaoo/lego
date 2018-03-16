import { Input } from 'antd';

import layout from './fieldLayout';

const defaultValue = {
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
};

export default function getInputInstance() {
  return {
    Component: Input,
    label: 'Input',
    import: 'Input',
    ...defaultValue,
  };
}
