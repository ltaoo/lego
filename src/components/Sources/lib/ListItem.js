import React from 'react';
import { List, Avatar } from 'antd';

function onChange() {}

const dataSource = [
  {
    title: 'Ant Design Title 1',
  },
  {
    title: 'Ant Design Title 2',
  },
  {
    title: 'Ant Design Title 3',
  },
  {
    title: 'Ant Design Title 4',
  },
];

const renderItem = item => (
    <List.Item>
      <List.Item.Meta
        avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
        title={<a href="https://ant.design">{item.title}</a>}
        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
      />
    </List.Item>
);

export default function getListInstance(params = {}) {
  const { uuid } = params;
  return {
    Component: List,
    label: 'ListItem',
    import: 'List',
    stateCode: `dataSource${uuid}:`,
    renderCode: `dataSource${uuid}`,
    didMount: `
      this.fetchData();
    `,
    mixProps: {
      // 这里要优化下，实际是其他值，但是要生成字符串这类属性，比如 options、columns
      dataSource,
      renderItem,
    },
    props: {
      itemLayout: 'horizontal',
      onChange,
      dataSource: `dataSource${uuid}`,
      renderItem: `item => (
        <List.Item>
          <List.Item.Meta
            avatar={<Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />}
            title={<a href="https://ant.design">{item.title}</a>}
            description="Ant Design, a design language for background applications, is refined by Ant UED Team"
          />
        </List.Item>
      )`,
    },
  };
}
