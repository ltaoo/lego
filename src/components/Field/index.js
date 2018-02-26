/**
 * @file Field - 即一个组件，由自身维护一个模态框
 * @author wuya
 */
import React from 'react';
import { findDOMNode } from 'react-dom';
import PropTypes from 'prop-types';
import { Form, Modal, Icon, Select, Row, Col } from 'antd';
import { DropTarget, DragSource } from 'react-dnd';

import store from '../../store';
import addComponent from '../../common/add-component';
import { 
  UPDATE_COMPONENT,
  SORT,
  APPEND_COMPONENT,
} from '../../common/actions';
import { ItemTypes } from '../../common/constants';
import createSource from '../../common/create-source';
import ComponentEditor from '../Editor';

const { Item: FormItem } = Form;
const { Option } = Select;

class Field extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editorModalVisible: false,
      hasDropped: false,
      hasDroppedOnChild: false,
    };
  }
  /**
   * 更新属性
   */
  updateProps = values => {
    const { item } = this.props;
    store.dispatch({
      type: UPDATE_COMPONENT,
      payload: {
        item,
        values,
      },
    });
    this.hideEditorModal();
  };
  /**
   * 移除组件
   */
  removeComponent = () => {
    const { item } = this.props;
    console.log(item);
    this.props.removeComponent(item.uuid);
  };
  /**
   * 查看源码
   */
  previewSource = () => {
    const { props: changedProps } = this.state;
    const { item, root } = this.props;
    const { props } = item;
    const newProps = Object.assign({}, { ...props }, changedProps);
    const code = root ? createSource(item, newProps) : '';
    console.log(code);
  };
  showEditorModal = () => {
    this.setState({
      editorModalVisible: true,
    });
  };
  hideEditorModal = () => {
    this.setState({
      editorModalVisible: false,
    });
  };
  renderComponent = () => {
    
  }
  render() {
    const { editorModalVisible } = this.state;
    const {
      form,
      item,
      connectDragSource,
      connectDropTarget,
      greedy,
      isOver,
      isOverCurrent,
      isDragging,
      connectDragPreview,
    } = this.props;

    const { getFieldDecorator } = form;
    const {
      label: Tag,
      Component,
      props,
      children = [],
      isField,
      fieldProps = {},
      mixProps,
    } = item;
    const {
      title,
      label,
      rules,
      initialValue,
      labelCol,
      wrapperCol,
    } = fieldProps;

    // todo: 使用策略模式拆分，对应的策略从 instanceObj 中读取，并且该部分逻辑在 create-source 以及 renderComponent 中也要用到
    let instanceCom = null;
    if (Tag === 'Col' || Tag === 'Row' || Tag === 'Card' || Tag === 'Modal') {
      const childrenComponent = children.map((child, i) => {
        return (
          <WrappedField
            {...this.props}
            key={child.uuid}
            item={child}
          />
        );
      });

      if (Tag === 'Modal') {
        instanceCom = <div>{childrenComponent}</div>;
      } else {
        instanceCom = <Component {...props}>{childrenComponent}</Component>;
      }
    } else if (Tag === 'Select') {
      const { options } = item;
      const chidlrenOptions = options.map((option, i) => (
        <Option key={i} value={option.value}>
          {option.label}
        </Option>
      ));
      instanceCom = <Component {...props}>{chidlrenOptions}</Component>;
    } else if (
      Tag === 'CheckboxGroup' ||
      Tag === 'RadioGroup' ||
      Tag === 'Cascader'
    ) {
      const { options } = item;
      const newProps = Object.assign(
        {},
        { ...props },
        {
          options,
          form: this.props.form,
        },
      );
      instanceCom = <Component {...newProps} />;
    } else if (Tag === 'Upload') {
      const { Component: Tag, props: childProps } = item.children[0];
      instanceCom = (
        <Component {...props}>
          <Tag {...childProps} />
        </Component>
      );
    } else if (Tag === 'Table') {
      const { columns, dataSource } = item;
      const newProps = Object.assign(
        {},
        { ...props },
        {
          columns,
          dataSource,
        },
      );
      instanceCom = <Component {...newProps} />;
    } else if (mixProps) {
      const {
        mixProps: {
          dataSource,
          renderItem,
        },
      } = item;
      const newProps = Object.assign(
        {},
        { ...props },
        {
          dataSource,
          renderItem,
        },
      );
      instanceCom = <Component {...newProps} />;
    } else {
      instanceCom = <Component {...props} />;
    }
      console.log(instanceCom, Tag);
    const modal = (
      <Modal
        title="编辑组件"
        visible={editorModalVisible}
        onOk={this.hideEditorModal}
        onCancel={this.hideEditorModal}
        footer={null}
      >
        <ComponentEditor submit={this.updateProps} instance={item} />
      </Modal>
    );
    const operators = (
      <div>
        <div className="edit__btn" onClick={this.showEditorModal}>
          <Icon type="edit" />
        </div>
        <div className="edit__btn" onClick={this.removeComponent}>
          <Icon type="delete" />
        </div>
        {connectDragSource(
          <div className="edit__btn">
            <Icon type="pushpin" />
          </div>
        )}
      </div>
    );
    // Button 要使用 Form.Item 布局但是不是字段，所以判断下要不要 getFieldDecorator
    const fieldInstance = label
      ? getFieldDecorator(label, {
          rules,
          initialValue,
        })(instanceCom)
      : instanceCom;

    let backgroundColor = '#fff';
		if (item.layout && (isOverCurrent || (isOver && greedy))) {
			backgroundColor = 'darkgreen'
    }
    const opacity = isDragging ? 0 : 1;
    let content = (
      <div className="field" style={{ background: backgroundColor, opacity }}>
        <div className="edit__wrapper">
          {operators}
          {isField ? (
            <FormItem label={title} labelCol={labelCol} wrapperCol={wrapperCol}>
              {fieldInstance}
            </FormItem>
          ) : (
            instanceCom
          )}
        </div>
        {modal}
      </div>
    );
    // if (item.label === 'Col') {
    //   return connectDropTarget(connectDragSource(<Col {...props}>{content}</Col>));
    // }
  
    // return connectDropTarget(connectDragSource(content));
    return connectDragPreview(connectDropTarget(content));
  }
}

Field.PropType = {
  item: PropTypes.object,
  isDragging: PropTypes.bool.isRequired,
  connectDragSource: PropTypes.func.isRequired,
  connectDropTarget: PropTypes.func.isRequired,
};
const fieldSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
      item: props.item,
    };
  },
};
/**
 * Implements the drag source contract.
 */
const fieldTarget = {
  /**
   * 
   * @param {*} props 
   * @param {*} monitor 
   * @param {*} component 
   */
  hover(props, monitor, component) {
    // 如果是从 Sidebar 拖到 Container，dataIndex === undefined
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;
    console.log(dragIndex, hoverIndex);
    // Don't replace items with themselves
    if (dragIndex === undefined || hoverIndex === undefined) {
      return;
    }
    if (dragIndex === hoverIndex) {
      return;
    }
    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
    // Determine mouse position
    const clientOffset = monitor.getClientOffset();
    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return;
    }
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return;
    }
    // Time to actually perform the action
    // props.moveCard(dragIndex, hoverIndex);
    store.dispatch({
      type: SORT,
      payload: {
        dragIndex,
        hoverIndex,
      },
    });
    monitor.getItem().index = hoverIndex;
  },
  drop(props, monitor, component) {
    const hasDroppedOnChild = monitor.didDrop();
    if (hasDroppedOnChild) {
			return;
    }
    // dropTarget
    const { item: source } = monitor.getItem();
    const target = props.item;
    if ((source.uuid === target.uuid) || !target.layout) {
      return;
    }
    const instance = source.uuid === undefined ? addComponent(source.label) : source;
    store.dispatch({
      type: APPEND_COMPONENT,
      payload: {
        parent: target.uuid,
        item: instance,
        // 是否要移除原先的
        remove: source.uuid !== undefined,
      },
    });
  },
};

/**
 * Specifies the props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
    connectDragPreview: connect.dragPreview(),
  };
}

function dropConnect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
  };
}

// 在 Field 内渲染 Field 没有 form 属性
const WrappedField = DropTarget(ItemTypes.FIELD, fieldTarget, dropConnect)(
  DragSource(ItemTypes.FIELD, fieldSource, collect)(Form.create()(Field)),
);
export default WrappedField;
