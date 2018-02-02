import {
    Button,
} from 'antd';

export default {
    Component: Button,
    label: 'Button',
    import: 'Button',
    notfield: 'true',
    props:{
        children: 'Click it',
        type: 'primary',
        onClick: this.handleClick,
    },
}
