import { Card } from 'antd';

export default function getCardInstance() {
  return {
    Component: Card,
    label: 'Card',
    import: 'Card',
    props: {
      bordered: true,
    },
  };
}
