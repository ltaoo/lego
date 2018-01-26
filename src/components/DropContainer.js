import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';
import { Col, Row } from 'antd';

import Square from './Square';
import { canMoveKnight, moveKnight, saveComponent } from './Game';
import { ItemTypes } from '../common/constants';

const squareTarget = {
  // 这里会大量触发
  canDrop(props) {
    // return canMoveKnight(props.x, props.y);
    return true;
  },

  drop(props, monitor, component) {
    console.log(props, monitor);
      saveComponent(component);
  },
};

function collect(connect, monitor) {
  return {
    connectDropTarget: connect.dropTarget(),
    isOver: monitor.isOver(),
    canDrop: monitor.canDrop(),
  };
}

class BoardSquare extends Component {
  renderOverlay(color) {
    return (
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          height: '100%',
          width: '100%',
          zIndex: 1,
          opacity: 0.5,
          backgroundColor: color,
        }}
      />
    );
  }

  render() {
    const { connectDropTarget, isOver, canDrop, components } = this.props;

    return connectDropTarget(
      <div
        style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}
      >
        <Row>
          <Col style={{ minHeight: 300 }}>
          </Col>
        </Row>
        {isOver && !canDrop && this.renderOverlay('red')}
        {!isOver && canDrop && this.renderOverlay('yellow')}
        {isOver && canDrop && this.renderOverlay('green')}
      </div>,
    );
  }
}

BoardSquare.propTypes = {
  connectDropTarget: PropTypes.func.isRequired,
  isOver: PropTypes.bool.isRequired,
  canDrop: PropTypes.bool.isRequired,
};

export default DropTarget(ItemTypes.BUTTON, squareTarget, collect)(BoardSquare);
