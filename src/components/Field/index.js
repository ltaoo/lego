/**
 * @file Field - 即一个字段，由自身维护一个模态框、源码字符串
 * @author ltaoo<litaowork@aliyun.com>
 */
import React from 'react';
import PropType from 'prop-types';
import { Form, Modal, Icon, Checkbox, Col } from 'antd';

import EventEmitter from '../../common/emitter';
import ComponentEditor from '../Editor';

const { Item: FormItem } = Form;
const nativeMethods = [
  'onClick',
  'onChange',
  'onInput',
];

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
   * 得到属性
   */
  writeProps = Component => {
    const { props, type } = Component;
    const { propTypes, defaultProps } = type;

    const propsText = [];
    const propsMap = {};

    const mergedProps = Object.assign({}, propTypes, defaultProps, props);
    const keys = Object.keys(mergedProps);
    for (let i = 0, l = keys.length; i < l; i += 1) {
      const key = keys[i];
        // 忽略 children
      if (key === 'children') {
        continue;
      }
      const val = mergedProps[key];
      if (val) {
        if (typeof val === 'string') {
          propsText.push(`${key}="${mergedProps[key]}"`);
          propsMap[key] = `"${val}"`;
        } else if (typeof val === 'boolean') {
          propsText.push(`${key}=${mergedProps[key]}`);
          propsMap[key] = val;
        } else if (typeof val === 'function') {
          console.dir(val);
          if (nativeMethods.indexOf(key) > -1) {
            propsText.push(`${key}={this.${mergedProps[key].name}}`);
          }
        }
      } else {
        propsText.push(`${key}={${mergedProps[key]}}`);
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
    const { formProps: { title, label, rules } } = this.state;
    const { notfield } = this.props.item;
    let code = '';
    for (let i = 0, l = components.length; i < l; i += 1) {
      const Component = components[i];
      console.log(Component);
      if (!Component) {
        continue;
      }
      if (typeof Component === 'string') {
        code += Component;
        continue;
      }
      const { type } = Component;
      const { name: tag } = type;
      // props
      let { text: propsText } = this.writeProps(Component);
      if (root && notfield !== 'true') {
        code += `<Form.Item label="${title}">{getFieldDecorator("${label}", {
          rules: ${JSON.stringify(rules)}
        })(<${tag} ${propsText}>`;
      } else {
        code += `<${tag} ${propsText}>`;
      }
      if (Component.props.children) {
        code += this.createSourceCode([Component.props.children]);
      }
      if (root && notfield !== 'true') {
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
    const { props: changedProps } = this.state;
    const { item } = this.props;
    const { Component, props } = item;
    const instance = <Component {...props} {...changedProps}></Component>;
    return this.createSourceCode([instance], true);
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
    if (item.label === 'Col') {
      return <Col {...props}>
        <div className="field">
          <div className="edit__wrapper">
            <div>
              <div className="edit__btn" onClick={this.showEditorModal}>
                <Icon type="edit" />
              </div>
              <div className="edit__btn" onClick={this.removeComponent}>
                <Icon type="delete" />
              </div>
              {container && <Checkbox onChange={this.selectRow}>勾选后会将组件添加到内部</Checkbox>}
            </div>
            {notfield !== 'true' ? <FormItem label={title}>
              {getFieldDecorator(label, {
                rules,
              })(instance)}
            </FormItem>
            : instance}
          </div>
          {modal}
        </div>
      </Col>
    }
    return (
      <div className="field">
        <div className="edit__wrapper">
          <div>
            <div className="edit__btn" onClick={this.showEditorModal}>
              <Icon type="edit" />
            </div>
            <div className="edit__btn" onClick={this.removeComponent}>
              <Icon type="delete" />
            </div>
            {container && <Checkbox onChange={this.selectRow}>勾选后会将组件添加到内部</Checkbox>}
          </div>
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
  }
}

Field.PropType = {
  item: PropType.object,
};

// 在 Field 内渲染 Field 没有 form 属性
const WrappedField = Form.create()(Field);
export default WrappedField;
