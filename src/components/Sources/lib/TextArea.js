import { Input } from 'antd';

import layout from './fieldLayout';

const { TextArea } = Input;

export default function getTextArea() {
  return {
    Component: TextArea,
    label: 'TextArea',
    import: 'Input',
    extra: 'const { TextArea } = Input;',
    field: {
      label: '活动形式',
      id: 'type',
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    props: {
      placeholder: '请输入活动形式',
    },
  };
}
