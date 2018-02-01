import React, { Component } from 'react';
import {
    Input,
    Button,
} from 'antd';

import './index.css';

let uuid = 1;

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components: props.components,
        };
    }

    renderComponent = ({ Component, label, name, props, innerText, options }) => {
        return (
            <Component {...props}>{innerText && innerText}</Component>
        );
    }

    handleClick = (tag) => {
        const props = Object.assign({}, {
            key: uuid,
        });

        const COMPONENT_MAP = {
            Input: this.renderComponent({
                Component: Input,
                props,
            }),
            Button: this.renderComponent({
                Component: Button,
                innerText: 'Click it',
                props: Object.assign({}, props, {
                    type: 'primary',
                }),
            }),
        };
        // 新增组件
        const component = {
            uuid,
            tag,
            field: 'field',
            component: COMPONENT_MAP[tag],
        };
        
        uuid += 1;
        this.props.handleClick(component);
    }

    render() {
        return (
            <div className="sidebar">
                <ul className="sidebar__components">
                    <li 
                        className="sidebar__component"
                        onClick={this.handleClick.bind(this, 'Input')}
                    >Text Input</li>
                    <li
                        className="sidebar__component"
                        onClick={this.handleClick.bind(this, 'Button')}
                    >Button</li>
                </ul>
            </div>
        );
    }
}

export default Sidebar;
