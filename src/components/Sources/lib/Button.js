import {
    Button,
} from 'antd';

// todo: 和下面的 methods 放到一起
function handleClick() {}

export default {
    Component: Button,
    label: 'Button',
    import: 'Button',
    notfield: 'true',
    // 这部分内容会被添加到页面代码中，todo: 自动判断生成
    constructorCode: 'this.handleClick = this.handleClick.bind(this);',
    methods: `
    handleClick () {
        const { validateFieldsAndScroll } = this.props.form;
        validateFieldsAndScroll([], function(err, values) {
            if (err) {
                return;
            }
                console.log(values);
                alert(JSON.stringify(values));
        });
    }
    `,
    props:{
        children: 'Click it',
        type: 'primary',
        onClick: handleClick,
    },
}
