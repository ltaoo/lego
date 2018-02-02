import React, { Component } from 'react';
import { Form, Input, Button, Select, Switch } from 'antd';

const { Item: FormItem } = Form;
const { Option } = Select;

class Sidebar extends Component {
  handleClick = () => {
    const { submit, form } = this.props;
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    submit(values);
  };

  /**
   * 渲染通用的 Input
   */
  renderCommonInput = () => {
    const { Component } = this.props;
    const { props, type } = Component;
    const { propTypes, defaultProps } = type;

    const { form } = this.props;
    const { getFieldDecorator } = form;

    const mergedProps = Object.assign({}, propTypes, defaultProps, props);
    const formItems = [];
    let i = 0;
    for (let key in mergedProps) {
      const val = mergedProps[key];
      if (val) {
        if (typeof val === 'string') {
          formItems.push(
            <FormItem key={i} label={key}>
              {getFieldDecorator(`props.${key}`, {
                initialValue: mergedProps[key],
              })(<Input />)}
            </FormItem>
          );
        } else if (typeof val === 'boolean') {
          formItems.push(
            <FormItem key={i} label={key}>
              {getFieldDecorator(`props.${key}`, {
                initialValue: mergedProps[key],
              })(<Select><Option val={true}>True</Option><Option val={false}>False</Option></Select>)}
            </FormItem>
          );
        }
      }
      
      i += 1;
    }
    return formItems;
  };

  /** 
   * 渲染校验字段
   */
  renderValidateInput = () => {
    const { getFieldDecorator } = this.props.form;
    const items = [
      <FormItem key={0} label="是否必选">
        {getFieldDecorator('rules[0].required', {
          initialValue: false,
        })(<Switch />)}
      </FormItem>,
      <FormItem key={0} label="提示文案">
        {getFieldDecorator('rules[0].message', {
        })(<Input />)}
      </FormItem>,
    ];
    return items;
  }

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const commonInputs = this.renderCommonInput();

    return (
      <div className="editor__form">
        <Form>
          <FormItem label="title">
            {getFieldDecorator('title')(<Input />)}
          </FormItem>
          <FormItem label="label">
            {getFieldDecorator('label')(<Input />)}
          </FormItem>
          {commonInputs}
          <Button type="primary" onClick={this.handleClick}>
            提交
          </Button>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Sidebar);
