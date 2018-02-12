import { Table } from 'antd';

function onChange() {}

const dataSource = [{
  key: '1',
  name: '胡彦斌',
  age: 32,
  address: '西湖区湖底公园1号'
}, {
  key: '2',
  name: '胡彦祖',
  age: 42,
  address: '西湖区湖底公园1号'
}];

const columns = [
  {
    title: '姓名',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: '年龄',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: '住址',
    dataIndex: 'address',
    key: 'address',
  },
];

export default function getTableInstance(params = {}) {
  const { uuid } = params;
  return {
    Component: Table,
    label: 'Table',
    import: 'Table',
    stateCode: `columns${uuid}:`,
    renderCode: `columns${uuid}`,
    // 实际的 columns
    columns,
    props: {
      onChange,
      columns: `columns${uuid}`,
    },
  };
}
