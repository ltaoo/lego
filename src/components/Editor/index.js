import React, { Component } from 'react';
import {
    Form,
    Input,
    Switch,
    Button,
} from 'antd';

const { Item: FormItem } = Form;

class Sidebar extends Component {
    handleClick = () => {
        const { submit, form } = this.props;
        const { getFieldsValue } = form;
        const values = getFieldsValue();
        submit(values);
    }

    render() {
        const { form } = this.props;
        const { getFieldDecorator } = form;
        return (
            <div className="editor__form">
                <Form>
                    {/* <FormItem label="是否表单">
                        {getFieldDecorator('field')(
                            <Switch defaultChecked />
                        )}
                    </FormItem> */}
                    <FormItem label="title">
                        {getFieldDecorator('title')(
                            <Input />
                        )}
                    </FormItem>
                    <FormItem label="label">
                        {getFieldDecorator('label')(
                            <Input />
                        )}
                    </FormItem>
                    <Button type="primary" onClick={this.handleClick}>提交</Button>
                </Form>
            </div>
        );
    }
}

export default Form.create()(Sidebar);
// export default Sidebar;
