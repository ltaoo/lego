import { Input } from 'antd';

export default {
  Component: Input,
  label: 'Input',
  import: 'Input',
  // 表单用字段
  isField: true,
  fieldProps: {
    title: '标题',
    label: 'name',
    rules: [],
  },
  props: {
    placeholder: '请输入用户名',
  },
}
