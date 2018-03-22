import { Input } from 'antd';

import layout from './fieldLayout';

const defaultLabel = '活动名称';
const defaultId = 'name';

export default function getInputInstance(params = {}) {
  const {
    label = defaultLabel,
    id = defaultId,
  } = params;
  return {
    Component: Input,
    label: 'Input',
    import: 'Input',
    // 表单用字段
    field: {
      label,
      id,
      rules: [{
        required: true,
        messsage: '请填写',
      }],
      ...layout,
    },
    props: {
      placeholder: '请输入',
    },
  };
}
