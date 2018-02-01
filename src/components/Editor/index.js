import React, { Component } from 'react';
import {
    Input,
    Button,
    Form,
} from 'antd';

const { Item: FormItem } = Form;

class Sidebar extends Component {
    constructor(props) {
        super(props);
    }

    submit = () => {
        const { getFieldsValue } = this.props.form;
        const values = getFieldsValue();
        console.log(values);
    }

    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="editor__form">
                <FormItem label="label">
                    {getFieldDecorator('label')(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="key">
                    {getFieldDecorator('key')(
                        <Input />
                    )}
                </FormItem>
                <Button type="primary" onClick={this.submit}>提交</Button>
            </div>
        );
    }
}

export default Form.create()(Sidebar);
