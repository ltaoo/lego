/**
 * @file 渲染组件
 * @author wuya
 */
import React from 'react';
import { Form } from 'antd';

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
    const { label, Component, isField, props, fieldProps, uuid, children } = instance;

    if (isField) {
      const { title, label } = fieldProps;
      const { form } = context;
      const { getFieldDecorator } = form;
      components.push(
        <Form.Item key={uuid} label={title}>
          {getFieldDecorator(label)(
            <Component {...props}>{renderComponent(children, context)}</Component>,
          )}
        </Form.Item>,
      );
    } else {
      if (label === 'Button') {
        components.push(
          <Component key={uuid} {...props}></Component>,
        );
      } else {
        components.push(
          <Component key={uuid} {...props}>
            {renderComponent(children, context)}
          </Component>,
        );
      }
    }
  }
  return components;
}
