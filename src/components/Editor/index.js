/**
 * @file 组件属性编辑组件
 * @author wuya
 */
import React, { Component } from 'react';
import { Row, Col, Divider, Icon, Form, Input, InputNumber, Button, Select, Switch } from 'antd';

const { Item: FormItem } = Form;
const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

let uuid = 0;

class Sidebar extends Component {
  /**
   * 移除 option
   */
  remove = (k) => {
    const { form } = this.props;
    // can use data-binding to get
    const keys = form.getFieldValue('keys');
    // can use data-binding to set
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  }
  /**
   * 新增 option
   */
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(uuid);
    uuid++;
    form.setFieldsValue({
      keys: nextKeys,
    });
  }
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
    const { form, instance } = this.props;
    const { getFieldDecorator } = form;
    const { Component, props } = instance;
    const { propTypes, defaultProps } = Component;

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
   * 表单字段相关的如 title、label、initialValue、rules等
   */
  renderFieldInputs = () => {
    const { form, instance } = this.props;
    const { getFieldDecorator } = form;
    const { isField, fieldProps } = instance;

    if (!isField) {
      return null;
    }

    const {
      title,
      label,
    } = fieldProps;

    const obj = {
      title,
      label,
    };

    const fields = ['title', 'label'];
    return fields.map((field, i) => {
      return <FormItem key={i} label={field}>
        {getFieldDecorator(`fieldProps.${field}`, {
          initialValue: obj[field],
        })(<Input />)}
      </FormItem>
    });
  }

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

  /** 
   * 渲染 options
   */
  renderOptions = (options) => {
    const { getFieldDecorator, getFieldValue } = this.props.form;
    const existOptions = options.map((option, i) => {
      return (
        <Row key={i} gutter={14}>
          <Col span={10}>
            <FormItem label="label" {...formItemLayout}>
              {getFieldDecorator(`options[${i}].label`, {
                initialValue: option.label,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label="value" {...formItemLayout}>
              {getFieldDecorator(`options[${i}].value`, {
                initialValue: option.value,
              })(<InputNumber />)}
              <Icon
                className="dynamic-delete-button"
                style={{ marginLeft: 20 }}
                type="minus-circle-o"
                onClick={() => this.removeExistOption()}
              />
            </FormItem>
          </Col>
        </Row>
      );
    });
    const keys = getFieldValue('keys');
    if (!keys) {
      return existOptions;
    }
    const newOptions = keys.map((k, index) => {
      const i = index + options.length;
      return (
        <Row key={i} gutter={14}>
          <Col span={10}>
            <FormItem label="label" {...formItemLayout}>
              {getFieldDecorator(`options[${i}].label`, {
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label="value" {...formItemLayout}>
              {getFieldDecorator(`options[${i}].value`, {
              })(<InputNumber />)}
              <Icon
                className="dynamic-delete-button"
                style={{ marginLeft: 20 }}
                type="minus-circle-o"
                onClick={() => this.remove(k)}
              />
            </FormItem>
          </Col>
        </Row>
      );
    });

    return existOptions.concat(newOptions);
  }

  render() {
    const { instance, form } = this.props;
    const { getFieldDecorator } = form;
    const fieldInputs = this.renderFieldInputs();
    const commonInputs = this.renderCommonInput();
    let optionInputs = null;
    if (instance.options && instance.options.length) {
      optionInputs = this.renderOptions(instance.options);
    }
    getFieldDecorator('keys', { initialValue: [] });
    return (
      <div className="editor__form">
        <Form>
          {commonInputs}
          <Divider>Fields</Divider>
          {fieldInputs}
          <Divider>Options</Divider>
          {optionInputs}
          <Button style={{ width: '100%' }} type="dashed" onClick={this.add}>
            <Icon type="plus" /> Add field
          </Button>
          <Divider></Divider>
          <Form.Item>
            <Button style={{ width: '100%' }} type="primary" onClick={this.handleClick}>
              提交
            </Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}

export default Form.create()(Sidebar);
