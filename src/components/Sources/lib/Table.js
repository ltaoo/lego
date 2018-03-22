import { Table } from 'antd';

function onChange() {}

const dataSource = [];

const defaultColumns = [
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
  const {
    uuid,
    columns = defaultColumns,
    modalUuid,
    api,
  } = params;

  return {
    Component: Table,
    label: 'Table',
    import: 'Table',
    extra: `import { message } from 'antd';`,
    stateCode: [`columns${uuid}:`, `dataSource${uuid}:`],
    renderCode: [`columns${uuid}`, `dataSource${uuid}`],
    didMount: `
      this.fetchData();
    `,
    methods: `
    fetchData () {
      fetch("${api}")
        .then(res => {
          return res.json();
        })
        .then((res) => {
          this.setState({
            dataSource${uuid}: res.d
          });
        })
        .catch(err => {
          console.log(err);
        });
    }
    createData = (data) => {
      const { resetFields } = this.props.form;
      fetch("${api}", {
        method: 'POST',
        data: data,
      })
        .then(res => {
          return res.json();
        })
        .then((res) => {
          resetFields();
          this.hideModal${modalUuid}();
          message.success('新增成功');
          this.fetchData();
        })
        .catch(err => {
          console.log(err);
        });
    }
    deleteData(id) {
      Modal.confirm({
        content: '确认要删除该记录吗？',
        onOk: () => {
          fetch(\`${api}/$\{id}\`, {
            method: 'DELETE',
          })
            .then(res => {
              return res.json();
            })
            .then((res) => {
              console.log(res);
            })
            .catch(err => {
              console.log(err);
            });
        },
      });
    }
    `,
    // 实际的 columns
    mergedProps: {
      columns,
      dataSource,
    },
    props: {
      onChange,
      columns: `columns${uuid}`,
      dataSource: `dataSource${uuid}`,
    },
  };
}
