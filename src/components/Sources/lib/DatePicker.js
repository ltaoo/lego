import { DatePicker } from 'antd';

import layout from './fieldLayout';

export default {
  Component: DatePicker,
  label: 'DatePicker',
  import: 'DatePicker',
  isField: true,
  fieldProps: {
    title: '活动时间',
    label: 'date',
    ...layout,
  },
  props: {
    placeholder: '请选择时间',
  },
};
