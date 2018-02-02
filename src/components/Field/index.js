/**
 * @file Field - 即一个字段，由自身维护一个模态框、源码字符串
 * @author ltaoo<litaowork@aliyun.com>
 */
import React from 'react';
import PropType from 'prop-types';
import { Form, Modal, Icon, Checkbox, Col } from 'antd';

import EventEmitter from '../../common/emitter';
import createSource from '../../common/create-source';
import ComponentEditor from '../Editor';

const { Item: FormItem } = Form;

class Field extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      // 表单相关的字段
      formProps: {
        title: 'label',
        label: 'label',
        rules: [],
      },
      // antd 组件会添加的属性
      props: {},
      options: {},
      isField: true,
      editorModalVisible: false,
    };
  }
  componentDidMount() {
    const { item: { uuid } } = this.props;
    const code = this.previewSource();
    EventEmitter.emit('updateComponent', {
        [uuid]: code,
    });
  }
  /**
   * 更新属性
   */
  updateProps = (values) => {
    console.log(values);
    const { item: { uuid } } = this.props;
    this.setState({
      formProps: {
        title: values.title,
        label: values.label,
        rules: values.rules,
      },
      props: {...values.props},
    }, function () {
        const code = this.previewSource();
        EventEmitter.emit('updateComponent', {
            [uuid]: code,
        });
    });
    this.hideEditorModal();
  }
  /**
   * 移除组件
   */
  removeComponent = () => {
    const { item } = this.props;
    this.props.removeComponent(item);
  };
  /**
   * 查看源码
   */
  previewSource = () => {
    const { props: changedProps } = this.state;
    const { item, root } = this.props;
    const { props } = item;
    const newProps = Object.assign({}, {...props}, changedProps);
    const code = root ? createSource(item, newProps) : '';
    console.log(code);
  }
  showEditorModal = () => {
      this.setState({
          editorModalVisible: true,
      });
  }
  hideEditorModal = () => {
      this.setState({
          editorModalVisible: false,
      });
  }
  /**
   * 选中 Row，接下来选择的组件都会填充到该组件内
   */
  selectRow = (e) => {
    const checked = e.target.checked;
    const { item } = this.props;
    this.props.switchContainer(item, checked);
  }
  render() {
    const {
      //
      form,
      // 包装对象
      item = {},
    } = this.props;
    const { formProps: { title, label, rules }, props: changedProps, editorModalVisible } = this.state;
    const { notfield, label: objLabel, container, Component, props, children = [] } = item;
    const childrenComponent = children.length > 0 ? children.map((child, i) => {
      return <WrappedField key={i} item={child} removeComponent={this.removeComponent}
        switchContainer={this.props.switchContainer}
       />;
    }) : null;

    const { getFieldDecorator } = form;
    let instance = <Component {...props} {...changedProps}></Component>;
    if (childrenComponent) {
      instance = <Component {...props} {...changedProps}>{childrenComponent}</Component>;
    }

    if (objLabel === 'Col') {
      instance = <div>{childrenComponent}</div>;
    }

    const modal = <Modal
          title="编辑组件"
          visible={editorModalVisible}
          onOk={this.hideEditorModal}
          onCancel={this.hideEditorModal}
          footer={null}
        >
          <ComponentEditor
            submit={this.updateProps}
            Component={instance}
          />
        </Modal>;

    const operators = (
      <div>
        <div className="edit__btn" onClick={this.showEditorModal}>
          <Icon type="edit" />
        </div>
        <div className="edit__btn" onClick={this.removeComponent}>
          <Icon type="delete" />
        </div>
        <div className="edit__btn" onClick={this.previewSource}>
          <Icon type="eye-o" />
        </div>
        {container && <Checkbox onChange={this.selectRow}>勾选后会将组件添加到内部</Checkbox>}
      </div>
    );
    const content = (
      <div className="field">
        <div className="edit__wrapper">
          {operators}
          {notfield !== 'true' ? <FormItem label={title}>
            {getFieldDecorator(label, {
              rules,
            })(instance)}
          </FormItem>
          : instance}
        </div>
        {modal}
      </div>
    );
    if (item.label === 'Col') {
      return <Col {...props}>
        {content}
      </Col>
    }
    return content;
  }
}

Field.PropType = {
  item: PropType.object,
};

// 在 Field 内渲染 Field 没有 form 属性
const WrappedField = Form.create()(Field);
export default WrappedField;
