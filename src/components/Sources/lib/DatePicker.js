import { DatePicker } from 'antd';

import layout from './fieldLayout';

export default function getDatePickerInstance() {
  return {
    Component: DatePicker,
    label: 'DatePicker',
    import: 'DatePicker',
    field: {
      label: '活动时间',
      id: 'date',
      rules: [{
        required: true,
        messsage: '请填写活动名称',
      }],
      ...layout,
    },
    props: {
      placeholder: '请选择时间',
    },
  };
}
