import { Row } from 'antd';

export default function getRowInstance() {
  return {
    Component: Row,
    label: 'Row',
    import: 'Row',
    layout: true,
    props: {
      gutter: 9,
    },
  };
}
