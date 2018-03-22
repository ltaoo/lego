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
   * 从表单中获取值，更新 instance
   * @param {Object} values - 表单值
   */
  updateProps = values => {
    const { formData } = values;
    const { item } = this.props;
    store.dispatch({
      type: UPDATE_COMPONENT,
      payload: {
        item,
        values: formData,
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
      field,
      mergedProps,
    } = item;
    // 处理 children
    let childrenComponent = null;
    if (children) {
      childrenComponent = children.map((child, i) => {
        return (
          <WrappedField
            {...this.props}
            key={child.uuid}
            item={child}
          />
        );
      });
    }
    // 处理 props
    let newProps = props;
    if (mergedProps) {
      newProps = Object.assign(
        {},
        { ...props },
        {
          ...mergedProps,
          form: this.props.form,
        },
      );
    }

    let instanceCom = <Component {...newProps} />;
    if (children && children.length) {
      instanceCom = <Component {...newProps}>{childrenComponent}</Component>;
    }
    // Modal 要特殊处理
    if (Tag === 'Modal') {
      instanceCom = <div><p>Modal</p>{childrenComponent}</div>;
    }
    
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
    // 用以拖拽时标志 container
    let backgroundColor = '#fff';
		if (item.layout && (isOverCurrent || (isOver && greedy))) {
			backgroundColor = 'darkgreen'
    }
    const opacity = isDragging ? 0 : 1;

    if (field) {
      const {
        id,
        label,
        rules,
        initialValue,
        labelCol,
        wrapperCol,
      } = field;
      instanceCom = (
        <FormItem label={label} labelCol={labelCol} wrapperCol={wrapperCol}>
          {getFieldDecorator(id, {
            rules,
            initialValue,
          })(instanceCom)}
        </FormItem>
      );
    }

    let content = (
      <div className="field" style={{ background: backgroundColor, opacity }}>
        <div className="edit__wrapper">
          {operators}
          {instanceCom}
        </div>
        {modal}
      </div>
    );
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
