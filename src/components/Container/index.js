/**
 * @file 组件编辑预览
 * @author wuya
 */
import React from 'react';
import { DropTarget } from 'react-dnd';

import store from '../../store';
import {
  ADD_COMPONENT,
  REMOVE_COMPONENT,
} from '../../common/actions';
import Field from '../Field';
import addComponent from '../../common/add-component';
import { ItemTypes } from '../../common/constants';

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
    if (item.uuid !== undefined) {
      return {
        moved: true,
      };
    }
    if (!item || !item.label) {
      return {
        moved: true,
      };
    }
    const instance = addComponent(item.label);
    store.dispatch({
      type: ADD_COMPONENT,
      payload: instance,
    });
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
  /**
   * 移除指定组件
   */
  removeComponent = uuid => {
    store.dispatch({
      type: REMOVE_COMPONENT,
      payload: {
        uuid,
      },
    });
  };
  /**
   * 渲染实例组件
   */
  renderComponent = () => {
    const { instances = [] } = this.props;
    return instances.map((instance, index) => {
      return (
        <Field
          key={instance.uuid}
          index={index}
          item={instance}
          // 用在获取嵌套组件代码的时候，只当 root === true 时才获取代码
          root
          removeComponent={this.removeComponent}
        />
      );
    });
  };

  render() {
    const { connectDropTarget } = this.props;
    const fields = this.renderComponent();
    return connectDropTarget(<div style={{ paddingBottom: 80, minHeight: 300 }}>{fields}</div>);
  }
}

export default DropTarget(ItemTypes.FIELD, chessSquareTarget, collect)(Container);
