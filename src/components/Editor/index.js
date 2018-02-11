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
  constructor(props) {
    super(props);

    const { instance } = props;
    this.state = {
      options: instance.options,
    };
  }
  /**
   * 移除 option
   */
  remove = (i) => {
    const { options } = this.state;
    options.splice(i, 1);
    this.setState({
      options: [...options],
    });
  }
  /**
   * 新增 option
   */
  add = () => {
    const { options } = this.state;
    this.setState({
      options: [
        ...options,
        {
          label: '',
          value: '',
        },
      ],
    });
  }
  /**
   * 提交表单更新组件
   */
  handleClick = () => {
    const { submit, form } = this.props;
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    // 处理下 rules
    values.fieldProps.rules = values.fieldProps.rules.filter(rule => {
      const keys = Object.keys(rule);
      return rule[keys[0]] && rule[keys[1]];
    });
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
  renderValidateInputs = () => {
    const { instance, form } = this.props;
    const { getFieldDecorator } = form;

    const MAP = ['Input', 'InputNumber'];
    const items = (
      <div>
        <Row gutter={8}>
          <Col span={6}>
            <FormItem label="是否必选">
              {getFieldDecorator('fieldProps.rules[0].required', {
                initialValue: false,
              })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="提示文案">
              {getFieldDecorator('fieldProps.rules[0].message', {
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        { MAP.indexOf(instance.label) > -1 && 
          <Row>
            <Col span={6}> 
              <FormItem label="最大值/长度">
                {getFieldDecorator('fieldProps.rules[1].max', {
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem label="提示文案">
                {getFieldDecorator('fieldProps.rules[1].message', {
                  initialValue: '请检查输入的长度',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="最小值/长度">
                {getFieldDecorator('fieldProps.rules[2].min', {
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem label="提示文案">
                {getFieldDecorator('fieldProps.rules[2].message', {
                  initialValue: '请检查输入的长度',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        }
      </div>
    );
    return items;
  }

  /** 
   * 渲染 options
   */
  renderOptions = () => {
    const { options } = this.state;
    const { getFieldDecorator } = this.props.form;
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
                onClick={this.remove.bind(this, i)}
              />
            </FormItem>
          </Col>
        </Row>
      );
    });
    return existOptions;
  }

  render() {
    const { instance, form } = this.props;
    const { getFieldDecorator } = form;
    // 表单字段类
    const fieldInputs = this.renderFieldInputs();
    // 校验项
    const validateInputs = this.renderValidateInputs();
    // defaultProps
    const commonInputs = this.renderCommonInput();
    // options
    let optionInputs = null;
    if (instance.options && instance.options.length) {
      optionInputs = (
        <div>
          <Divider>Options</Divider>
          {this.renderOptions(instance.options)}
          <Button style={{ width: '100%' }} type="dashed" onClick={this.add}>
            <Icon type="plus" /> Add field
          </Button>
          <Divider></Divider>
        </div>
      );
    }
    getFieldDecorator('keys', { initialValue: [] });
    return (
      <div className="editor__form">
        <Form>
          {commonInputs}
          <Divider>Fields</Divider>
          {fieldInputs}
          <Divider>Validate</Divider>
          {validateInputs}
          {optionInputs}
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
