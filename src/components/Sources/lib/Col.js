import {
    Col,
} from 'antd';

export default function getColInstance() {
    return {
        Component: Col,
        label: 'Col',
        import: 'Col',
        layout: true,
        props: {
            span: 8,
        },
    };
}

