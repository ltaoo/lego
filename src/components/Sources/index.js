import React, { Component } from 'react';
import {
    Input,
    Button,
    Form,
} from 'antd';

import './index.css';

const { Item: FormItem } = Form;

let uuid = 1;


class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            components: [],
        };
    }

    renderComponent = ({ Component, label, name, props, innerText, options }) => {
        const { getFieldDecorator } = this.props.form;
        return (
            <FormItem label={label}>
                {getFieldDecorator(name, {
                    rules: [],
                })(
                    <Component {...props}>{innerText && innerText}</Component>
                )}
            </FormItem>
        );
    }

    handleClick = (tag) => {
        const { components } = this.state;
        const props = Object.assign({}, {
            key: uuid,
        });

        const COMPONENT_MAP = {
            Input: this.renderComponent({
                Component: Input,
                label: 'label',
                name: 'key',
                props,
            }),
            Button: this.renderComponent({
                Component: Button,
                name: 'password',
                innerText: 'Click it',
                props: Object.assign({}, props, {
                    type: 'primary',
                }),
            }),
        };

        console.log(COMPONENT_MAP);
        // 新增组件
        const component = {
            uuid,
            tag,
            field: 'field',
            component: COMPONENT_MAP[tag],
        };
        components.push(component);
        this.setState({
            components: [...components],
        });

        this.props.handleClick([...components]);

        uuid += 1;
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

export default Form.create()(Sidebar);
