import React, { Component } from 'react';
import { Input, Button } from 'antd';

import './index.css';

let uuid = 1;

class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      components: props.components,
    };
  }
  handleClick = tag => {
    const props = Object.assign(
      {},
      {
        key: uuid,
      },
    );
    const COMPONENT_MAP = {
      Input: {
        Component: Input,
        props: Object.assign({}, props, {
          placeholder: '请输入用户名',
        }),
      },
      Button: {
        Component: Button,
        notfield: 'true',
        props: Object.assign({}, props, {
          children: 'Click it',
          type: 'primary',
          onClick: this.handleClick,
        }),
      },
    };
    // 新增组件
    const component = {
      uuid,
      tag,
      ...COMPONENT_MAP[tag],
    };

    uuid += 1;
    this.props.handleClick(component);
  };

  render() {
    return (
      <div className="sidebar">
        <ul className="sidebar__components">
          <li
            className="sidebar__component"
            onClick={this.handleClick.bind(this, 'Input')}
          >
            Text Input
          </li>
          <li
            className="sidebar__component"
            onClick={this.handleClick.bind(this, 'Button')}
          >
            Button
          </li>
        </ul>
      </div>
    );
  }
}

export default Sidebar;
