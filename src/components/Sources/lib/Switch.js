import { Switch } from 'antd';

import layout from './fieldLayout';

export default function getSwitchInstance() {
  return {
    Component: Switch,
    label: 'Switch',
    import: 'Switch',
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '即时配送',
      label: 'quick',
      rules: [],
      ...layout,
    },
    props: {},
  };
}
