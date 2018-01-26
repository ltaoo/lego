import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

import { ItemTypes } from '../common/constants';
import { saveComponent } from './Game';

export default function wrapItem(CustomerComponent, type) {
  const knightSource = {
    beginDrag(props, monitor, component) {
        console.log(props, component);
        saveComponent(component);
      return {};
    },
  };

  function collect(connect, monitor) {
    return {
      connectDragSource: connect.dragSource(),
      isDragging: monitor.isDragging(),
    };
  }

  class Knight extends Component {
    render() {
      const { connectDragSource, isDragging } = this.props;
      return connectDragSource(
        <div
          style={{
            opacity: isDragging ? 0.5 : 1,
            fontSize: 18,
            fontWeight: 'bold',
            cursor: 'move',
          }}
        >
            {CustomerComponent}
        </div>,
      );
    }
  }

  Knight.propTypes = {
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  return DragSource(ItemTypes[type], knightSource, collect)(Knight);
}
