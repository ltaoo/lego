/**
 * @file 渲染组件
 * @author wuya
 */
import React from 'react';
import {
    Form
} from 'antd';

/**
 * @param {Array} instances - 实例对象数组
 */
export default function renderComponent(instances, context) {
    const components = [];
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    const { Component, isField, props, fieldProps, uuid } = instance;
    
    if (isField) {
        const { title, label, rules } = fieldProps;
        const { form } = context;
        const { getFieldDecorator } = form;
        components.push(
            <Form.Item key={uuid} label={title}>
                {getFieldDecorator(label)(
                    <Component {...props}></Component>
                )}
            </Form.Item>
        );
    } else {
        components.push(<Component key={uuid} {...props}></Component>);
    }
  }
  return components;
}
