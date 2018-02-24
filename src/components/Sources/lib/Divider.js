import { Divider } from 'antd';

export default function getDividerInstance() {
  return {
    Component: Divider,
    label: 'Divider',
    import: 'Divider',
    props: {
      dashed: false,
    },
  };
}
