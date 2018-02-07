import { Input } from 'antd';

import layout from './fieldLayout';

const { TextArea } = Input;

export default function getTextArea() {
  return {
    Component: TextArea,
    label: 'TextArea',
    isField: true,
    fieldProps: {
      title: '活动形式',
      label: 'type',
      ...layout,
    },
    extra: 'const { TextArea } = Input;',
    props: {
      placeholder: '请输入活动形式',
    },
  };
}
