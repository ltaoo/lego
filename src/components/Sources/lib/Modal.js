import { Modal } from 'antd';

function handleCancel() {}
function handleOk() {}

const defaultTitle = 'Modal';

export default function getModalInstance(params = {}) {
  const {
    uuid,
    title = defaultTitle,
    children = [],
  } = params;
  return {
    Component: Modal,
    label: 'Modal',
    import: 'Modal',
    stateCode: `visible${uuid}: false`,
    renderCode: `visible${uuid}`,
    constructorCode: `
    this.handleOk = this.handleOk.bind(this);
    this.showModal${uuid} = this.showModal${uuid}.bind(this);
    this.hideModal${uuid} = this.hideModal${uuid}.bind(this);
    `,
    layout: true,
    methods: `
    handleOk() {
      const { validateFieldsAndScroll } = this.props.form;
      validateFieldsAndScroll((err, data) => {
        if (err) {
          return;
        }
        this.createData(data);
      })
    }
    /**
     * 展示模态框
     */
    showModal${uuid}(e) {
      this.setState({
        visible${uuid}: true,
      });
    }
    /**
     * 隐藏模态框
     */
    hideModal${uuid}(e) {
      this.setState({
        visible${uuid}: false,
      });
    }
    `,
    mergedProps: {
      visible: false,
    },
    children,
    props: {
      title,
      visible: `visible${uuid}`,
      onOk: handleOk,
      onCancel: handleCancel,
    },
  };
}
