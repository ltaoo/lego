import { Button } from 'antd';

// todo: 和下面的 methods 放到一起
function handleClick() {}

export default function getButtonInstance(params = {}) {
  const { text = '提交', type = 'primary' } = params;
  return {
    Component: Button,
    label: 'Button',
    import: 'Button',
    // 这部分内容会被添加到页面代码中，todo: 自动判断生成
    constructorCode: 'this.handleClick = this.handleClick.bind(this);',
    methods: `
    handleClick () {
      const { getFieldsValue } = this.props.form;
      const values = getFieldsValue();
      console.log(values);
      alert(JSON.stringify(values));
    }
    `,
    // 表单用字段
    isField: true,
    fieldProps: {
      title: '',
      label: null,
      rules: [],
      wrapperCol: {
        offset: 2,
      },
    },
    props: {
      children: text,
      type,
      onClick: handleClick,
    },
  };
};
