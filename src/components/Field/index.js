import React, { Component } from 'react';
import PropType from 'prop-types';
import { Form, Modal, Icon } from 'antd';

import ComponentEditor from '../Editor';

const { Item: FormItem } = Form;

class Field extends Component {
  constructor(props) {
    super(props);

    this.state = {
      title: 'label',
      label: 'label',
      options: {},
      editorModalVisible: false,
    };
  }
  /**
   * 编辑属性
   * @param {ReactComponent} component - 要编辑的组件
   */
  handleEditProps = (component) => {
    console.log(component);
    this.showEditorModal();
  }
  /**
   * 更新属性
   */
  updateProps = (values) => {
    // const { props } = this.writeProps(component.component);
    // console.log(props);
    const currentState = {...this.state};
    const newState = Object.assign({}, currentState, values);
    this.setState(newState);
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
   * 得到属性
   */
  writeProps = Component => {
    const { props, type } = Component;
    const { propTypes, defaultProps } = type;
    const propsText = [];
    const propsMap = {};
    for (let key in propTypes) {
      if (key === 'children') {
        continue;
      }
      const val = props[key];
      const defaultVal = defaultProps[key];
      if (val) {
        if (typeof val === 'string') {
          propsText.push(`${key}="${props[key]}"`);
          propsMap[key] = `"${val}"`;
        } else if (typeof val === 'boolean') {
          propsText.push(`${key}=${props[key]}`);
          propsMap[key] = val;
        }
      }
    }
    return {
      props: propsMap,
      text: propsText.join(' '),
    };
  };
  /**
   * 根据组件得到源码
   */
  createSourceCode = (components, root) => {
      const { title, label } = this.state;
    let code = '';
    for (let i = 0, l = components.length; i < l; i += 1) {
      const Component = components[i];
      if (!Component) {
        continue;
      }
      if (typeof Component === 'string') {
        code += Component;
        continue;
      }
      const { type, props } = Component;
      const { name: tag } = type;
      // props
      const { text: propsText } = this.writeProps(Component);
      if (root) {
        code += `<Form.Item label="${title}">{getFieldDecorator("${label}")(<${tag} ${propsText}>`;
      } else {
        code += `<${tag} ${propsText}>`;
      }
      if (Component.props.children) {
        code += this.createSourceCode([Component.props.children]);
      }
      if (root) {
        code += `</${tag}>)}</Form.Item>`;
      } else {
        code += `</${tag}>`;
      }
    }
    return code;
  };
  /**
   * 查看源码
   */
  previewSource = () => {
    const { item: { component }} = this.props;
    const code = this.createSourceCode([component], true);
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
  render() {
    const {
      //
      form,
      children,
    } = this.props;
    const { title, label, options, editorModalVisible } = this.state;
    const { getFieldDecorator } = form;
    return (
      <div className="field">
        <div className="edit__wrapper">
          <div>
            <div className="edit__btn" onClick={this.handleEditProps}>
              <Icon type="edit" />
            </div>
            <div className="edit__btn" onClick={this.removeComponent}>
              <Icon type="delete" />
            </div>
            <div className="edit__btn" onClick={this.previewSource}>
                <Icon type="eye-o" />
            </div>
          </div>
          <FormItem label={title}>
            {getFieldDecorator(label, options)(children)}
          </FormItem>
        </div>
        <Modal
          title="编辑组件"
          visible={editorModalVisible}
          onOk={this.hideEditorModal}
          onCancel={this.hideEditorModal}
          footer={null}
        >
          <ComponentEditor submit={this.updateProps} />
        </Modal>
      </div>
    );
  }
}

Field.PropType = {
  // 显示的字段名
  title: PropType.string,
  // 该字段对应的 key
  label: PropType.string,
  item: PropType.object,
};

Field.defaultProps = {
  title: 'label',
  label: 'label',
};

export default Form.create()(Field);
