/**
 * @file 渲染组件
 * @author wuya
 */
import React from 'react';
import { Form, Select } from 'antd';

const { Option } = Select;

/**
 * @param {Array} instances - 实例对象数组
 */
export default function renderComponent(instances, context) {
  if (!instances) {
    return null;
  }
  const components = [];
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { label, Component, isField, props, fieldProps, uuid, children, options = [] } = instance;
    if (isField) {
      const { title, label: id, rules, initialValue, labelCol, wrapperCol } = fieldProps;
      const { form } = context;
      const { getFieldDecorator } = form;

      let c = <Component {...props}>{renderComponent(children, context)}</Component>;
      if (label === 'Button') {
        c = <Component {...props}>{props.children}</Component>;
      }
      if (label === 'Select') {
        c = <Component {...props}>{options.map(option => <Option key={i} value={option.value}>{option.label}</Option>)}</Component>;
      }

      const fieldComponent = id
        ? getFieldDecorator(id, {
          rules,
          initialValue,
        })(
          c
        )
        : c;

      components.push(
        <Form.Item key={uuid} label={title} labelCol={labelCol} wrapperCol={wrapperCol}>
          {fieldComponent}
        </Form.Item>,
      );
    } else {
      components.push(
        <Component key={uuid} {...props}>
          {renderComponent(children, context)}
        </Component>,
      );
    }
  }
  return components;
}
