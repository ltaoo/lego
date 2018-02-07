import {
    DatePicker,
} from 'antd';

export default {
    Component: DatePicker,
    label: 'DatePicker',
    import: 'DatePicker',
    isField: true,
    fieldProps: {
        title: '时间',
        label: 'date',
    },
    props: {
        placeholder: '请选择时间',
    },
}
