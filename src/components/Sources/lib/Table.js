import { Table } from 'antd';

function onChange() {}

const dataSource = [];

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
    stateCode: [`columns${uuid}:`, `dataSource${uuid}:`],
    renderCode: [`columns${uuid}`, `dataSource${uuid}`],
    didMount: `
    fetch("https://easy-mock.com/mock/59b77cf5e0dc663341a6b6c2/example/ary")
      .then(res => {
        return res.json();
      })
      .then((res) => {
        this.setState({
          dataSource1: res.d
        });
      })
      .catch(err => {
        console.log(err);
      });
    `,
    // 实际的 columns
    columns,
    dataSource,
    props: {
      onChange,
      columns: `columns${uuid}`,
      dataSource: `dataSource${uuid}`,
    },
  };
}
