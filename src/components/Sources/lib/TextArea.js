import {
    Input,
} from 'antd';

const { TextArea } = Input;

export default {
    Component: TextArea,
    label: 'TextArea',
    extra: 'const { TextArea } = Input;',
    props: {
        placeholder: '请输入正文内容',
    },
}
