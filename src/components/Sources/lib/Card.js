import { Card } from 'antd';

export default function getCardInstance() {
  return {
    Component: Card,
    label: 'Card',
    import: 'Card',
    layout: true,
    props: {
      bordered: true,
    },
  };
}
