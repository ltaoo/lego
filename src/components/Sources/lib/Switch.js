import { Switch } from 'antd';

import layout from './fieldLayout';

export default function getSwitchInstance() {
  return {
    Component: Switch,
    label: 'Switch',
    import: 'Switch',
    // 表单用字段
    field: {
      label: '即时配送',
      id: 'quick',
      initialValue: false,
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    props: {},
  };
}
