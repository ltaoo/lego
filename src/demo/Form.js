import React, { Component } from 'react';
import {
    Input,
    Button,
    Form,
} from 'antd';

const { Item: FormItem } = Form;

class FormDemo extends Component {
    submit = () => {
        const { getFieldsValue } = this.props.form;
        const values = getFieldsValue();
        console.log(values);
    }
    render() {
        const { getFieldDecorator } = this.props.form;
        return (
            <div>
                <FormItem label="name">
                    {getFieldDecorator('name', {
                        rules: [
                            {
                                required: true,
                                message: '请填写用户名',
                            },
                        ],
                    })(
                        <Input />
                    )}
                </FormItem>
                <FormItem label="password">
                    {getFieldDecorator('password')(
                        <Input />
                    )}
                </FormItem>
                <Button type="primary" onClick={this.submit}>Click it</Button>
            </div>
        );
    }
}

export default Form.create()(FormDemo);
