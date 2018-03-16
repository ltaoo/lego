/**
 * @file 预览渲染组件
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
  if (typeof instances === 'string') {
    return instances;
  }
  const components = [];
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    // const {
    //   label,
    //   props,
    //   field,
    //   uuid,
    //   children,
    //   mergedProps,
    // } = instance;
    const { form } = context;
    const { getFieldDecorator } = form;
    const {
      Component,
      props,
      children = [],
      field,
      mergedProps,
    } = instance;
    let instanceCom = null;
    // 处理 children
    // let childrenComponent = null;
    // if (children) {
    //   childrenComponent = children.map((child, i) => {
    //     return (
    //       <WrappedField
    //         {...this.props}
    //         key={child.uuid}
    //         item={child}
    //       />
    //     );
    //   });
    // }
    // 处理 props
    let newProps = props;
    if (mergedProps) {
      newProps = Object.assign(
        {},
        { ...props },
        {
          ...mergedProps,
          form,
          key: i,
        },
      );
    }

    console.log(newProps);

    instanceCom = (children && children.length)
      ? <Component {...newProps}>{renderComponent(children, context)}</Component>
      : <Component {...newProps} />;
    
    if (field) {
      const {
        id,
        label,
        rules,
        initialValue,
        labelCol,
        wrapperCol,
      } = field;

      instanceCom = (
        <Form.Item key={i} label={label} labelCol={labelCol} wrapperCol={wrapperCol}>
          {getFieldDecorator(id, {
            rules,
            initialValue,
          })(instanceCom)}
        </Form.Item>
      );
    }
    
    components.push(instanceCom);

    // if (field) {
    //   const {
    //     label,
    //     id,
    //     rules,
    //     initialValue,
    //     labelCol,
    //     wrapperCol,
    //   } = field;
    //   const { form } = context;
    //   const { getFieldDecorator } = form;
    //   // 这里
    //   const temp = { ...props };
    //   const {
    //     options,
    //   } = mergedProps;
    //   if (options) {
    //     temp.options = options;
    //   }
    //   let c = (
    //     <Component {...temp}>{renderComponent(children, context)}</Component>
    //   );
    //   if (label === 'Select') {
    //     c = (
    //       <Component {...temp}>
    //         {options.map(option => (
    //           <Option key={i} value={option.value}>
    //             {option.label}
    //           </Option>
    //         ))}
    //       </Component>
    //     );
    //   }

    //   const fieldComponent = id
    //     ? getFieldDecorator(id, {
    //         rules,
    //         initialValue,
    //       })(c)
    //     : c;

    //   components.push(
    //     <Form.Item
    //       key={uuid}
    //       label={label}
    //       labelCol={labelCol}
    //       wrapperCol={wrapperCol}
    //     >
    //       {fieldComponent}
    //     </Form.Item>,
    //   );
    // } else {
    //   if (mergedProps) {
    //     components.push(
    //       <Component
    //         key={uuid}
    //         {...props}
    //         {...mergedProps}
    //       >
    //         {renderComponent(children, context)}
    //       </Component>,
    //     );
    //     continue;
    //   }
    //   // 这里也很 low ....
    //   if (label === 'Table') {
    //     const { columns, dataSource } = instance;
    //     components.push(
    //       <Component
    //         key={uuid}
    //         {...props}
    //         columns={columns}
    //         dataSource={dataSource}
    //       >
    //         {renderComponent(children, context)}
    //       </Component>,
    //     );
    //   } else if (label === 'Modal') {
    //     const newProps = {...props};
    //     newProps.visible = false;

    //     components.push(
    //       <Component key={uuid} {...newProps}>
    //         {renderComponent(children, context)}
    //       </Component>,
    //     );
    //   } else {
    //     components.push(
    //       <Component key={uuid} {...props}>
    //         {renderComponent(children, context)}
    //       </Component>,
    //     );
    //   }
    // }
  }
  return components;
}
