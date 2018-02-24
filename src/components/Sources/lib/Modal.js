import { Modal } from 'antd';

function handleCancel() {}
function handleOk() {}

export default function getModalInstance(params = {}) {
  const { uuid } = params;
  return {
    Component: Modal,
    label: 'Modal',
    import: 'Modal',
    stateCode: `visible${uuid}: false`,
    renderCode: `visible${uuid}`,
    constructorCode: `
    this.handleOk = this.handleOk.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    `,
    layout: true,
    methods: `
    handleOk${uuid}(e) {
      console.log(e);
      this.setState({
        visible${uuid}: false,
      });
    }
    handleCancel${uuid}(e) {
      console.log(e);
      this.setState({
        visible${uuid}: false,
      });
    }
    `,
    props: {
      title: 'Modal',
      visible: `visible${uuid}`,
      onOk: handleOk,
      onCancel: handleCancel,
    },
  };
}
