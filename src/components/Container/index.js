/**
 * @file 组件编辑预览
 * @author wuya
 */
import React from 'react';
import { DropTarget } from 'react-dnd';

import Field from '../Field';
import EventEmitter from '../../common/emitter';
import addComponent from '../../common/add-component';
import { ItemTypes } from '../../common/constants';
import { updateProps, removeComponent } from '../../common/util';

/**
 * Specifies the drop target contract.
 * All methods are optional.
 */
const chessSquareTarget = {
  canDrop(props, monitor) {
    // You can disallow drop based on props or item
    // const item = monitor.getItem();
    // return canMakeChessMove(item.fromPosition, props.position);
    // console.log(item);
    return true;
  },
  drop(props, monitor, component) {
    if (monitor.didDrop()) {
      // If you want, you can check whether some nested
      // target already handled drop
      return;
    }

    // Obtain the dragged item
    const { item } = monitor.getItem();
    addComponent(item.label);
    // You can do something with it
    // ChessActions.movePiece(item.fromPosition, props.position);

    // You can also do nothing and return a drop result,
    // which will be available as monitor.getDropResult()
    // in the drag source's endDrag() method
    return { moved: true };
  }
};

/**
 * Specifies which props to inject into your component.
 */
function collect(connect, monitor) {
  return {
    // Call this function inside render()
    // to let React DnD handle the drag events:
    connectDropTarget: connect.dropTarget(),
    // You can ask the monitor about the current drag state:
    isOver: monitor.isOver(),
    isOverCurrent: monitor.isOver({ shallow: true }),
    canDrop: monitor.canDrop(),
    itemType: monitor.getItemType()
  };
}

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instances: [],
      currentInstance: {},
    };
  }
  componentDidMount() {
    EventEmitter.on('addComponent', (obj) => {
      const { instances, currentInstance } = this.state;
      // 如果是布局组件
      if (currentInstance.layout) {
        currentInstance.children = currentInstance.children || [];
        currentInstance.children.push(obj);
      } else {
        instances.push(obj);
      }
      this.setState({
        instances: [...instances],
      });
    });
    EventEmitter.on('updateComponent', (item, values) => {
      const { instances } = this.state;
      const { uuid } = item;
      // const { fieldProps: newFieldProps, props: newProps, options } = values;

      // 递归寻找 uuid 对应的那个实例对象并更新 fieldProps 和 props
      updateProps(uuid, instances, values);
    });
  }
  /**
   * 移除指定组件
   */
  removeComponent = item => {
    const { instances } = this.state;
    removeComponent(item.uuid, instances);
    this.setState({
      instances: [...instances],
    });
  };
  /**
   * 切换容器
   */
  switchContainer = (item, checked) => {
    console.log(item, checked);
    this.setState({
      currentInstance: checked ? item : {},
    });
  };
  /**
   * 渲染实例组件
   */
  renderComponent = () => {
    const { instances } = this.state;
    return instances.map((instance) => {
      return (
        <Field
          key={instance.uuid}
          item={instance}
          // 用在获取嵌套组件代码的时候，只当 root === true 时才获取代码
          root
          removeComponent={this.removeComponent}
          switchContainer={this.switchContainer}
        />
      );
    });
  };

  render() {
    const { connectDropTarget } = this.props;
    const fields = this.renderComponent();
    return connectDropTarget(<div style={{ minHeight: 300 }}>{fields}</div>);
    // return (<div>{fields}</div>);
  }
}

export default DropTarget(ItemTypes.FIELD, chessSquareTarget, collect)(Container);
// export default Container;
