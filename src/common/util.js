/**
 * @file 处理 instances 的一些方法
 * @author wuya
 */
import React from 'react';
import {
  Button,
} from 'antd';

import getButtonInstance from '../components/Sources/lib/Button';
import getTableInstance from '../components/Sources/lib/Table';
import getModalInstance from '../components/Sources/lib/Modal';
import getInputInstance from '../components/Sources/lib/Input';

export function findInstance(uuid, instances) {
  let res = null;
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    console.log(instance, uuid);
    if (instance.uuid === uuid) {
      res = instance;
      break;
    }
    if (instance.children) {
      res = findInstance(uuid, instance.children);
    }
  }
  return res;
}

/**
 * 更新属性
 * @param {*} uuid
 * @param {*} instances
 * @param {*} values
 */
export function updateProps(uuid, instances, values) {
  const {
    field,
    props,
    mergedProps
  } = values;
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      if (field) {
        instance.field = Object.assign({}, instance.fieldProps, field);
      }
      if (props) {
        instance.props = Object.assign({}, instance.props, props);
      }
      if (mergedProps) {
        instance.mergedProps = Object.assign({}, instance.mergedProps, mergedProps);
      }
      break;
    }
    if (instance.children && instance.children.length) {
      updateProps(uuid, instance.children, values);
    }
  }
}

/**
 * 移除指定组件
 * @param {number} uuid - 组件 id
 * @param {Array|Object} instances
 */
export function removeComponent(uuid, instances) {
  for (let i = 0, l = instances.length; i < l; i += 1) {
    const instance = instances[i];
    if (instance.uuid === uuid) {
      const index = instances.indexOf(instance);
      instances.splice(index, 1);
      break;
    }
    if (instance.children && instance.children.length) {
      removeComponent(uuid, instance.children);
    }
  }
}

/**
 * 获取变量类型
 * @param {*} variable 
 * @return string
 */
export function getType(variable) {
  const type = Object.prototype.toString.call(variable);
  return type.slice(8, -1);
}

/**
 * 根据 defaultValue 生成 schema
 * @param {*} defaultValue 
 */
export function createSchemaByDefaultValue(defaultValue, key) {
  if (getType(defaultValue) === 'Object') {
    const properties = {};
    for (let key in defaultValue) {
      properties[key] = createSchemaByDefaultValue(defaultValue[key], key);
    }
    return {
      type: 'object',
      properties: properties,
    };
  }
  if (getType(defaultValue) === 'Array') {
    if (key && key === 'options') {
      return {
        type: 'array',
        default: defaultValue,
        items: {
          type: 'object',
          properties: {
            label: {
              type: 'string',
            },
            value: {
              type: 'integer',
            },
          },
        },
      };
    }
    if (key && key === 'columns') {
      return {
        type: 'array',
        default: defaultValue,
        items: {
          type: 'object',
          properties: {
            title: {
              type: 'string',
            },
            dataIndex: {
              type: 'string',
            },
            key: {
              type: 'string',
            },
          },
        },
      };
    }
    if (!key || key === 'dataSource') {
      return {};
    }
    return {
      type: 'array',
      default: defaultValue,
      items: defaultValue.map(item => createSchemaByDefaultValue(item)),
    };
  }

  if (getType(defaultValue) === 'Function') {
    return {
      type: 'string',
    };
  }
  return {
    type: typeof defaultValue,
    title: key,
    default: defaultValue,
  };
}

/**
 * 创建表单
 * @return {Array}
 */
function createForm(schema, i) {
  return schema.filter(item => {
    return item !== 'id';
  }).map(item => {
    i += 1
    return {
      uuid: i,
      ...getInputInstance({
        uuid: i,
        label: item,
        id: item,
      }),
    };
  });
}

/** 
 * 生成 instances，以 banner 配置为例
 * {
    id: 0,
    title: '这是第一个 Banner',
    pic: '//www.kujiale.com/img.jpg',
    url: '//www.kujiale.com'
 * }
 */
export const createInstances = (function () {
  let i = 0;
  return function ({ schema, api }) {
    const instances = [];
    const keys = Object.keys(schema);
    // Table
    const columns = keys.map((key, i) => {
      return {
        title: key,
        dataIndex: key,
        key,
      };
    });
    instances.push({
      uuid: i,
      ...getTableInstance({
        uuid: i,
        columns,
        api,
        modalUuid: i + 1,
      })
    });
    i += 1;
    // Modal
    const modalUuid = i;
    instances.push({
      uuid: i,
      ...getModalInstance({
        uuid: i,
        title: '新增数据',
        children: createForm(keys, i),
        onOk: `
          this.createItem();
        `,
        onCancel: `
          this.hideModal${i}();
        `,
      }),
    });
    i += keys.length;
    // 新增按钮
    instances.unshift({
      uuid: i,
      ...getButtonInstance({
        uuid: i,
        text: '新增',
        click: `
          handleClick() {
            this.showModal${modalUuid}();
          }
        `,
      }),
    });
    i += 1;
    // 暂时没有编辑功能
    // instances.push({
    //   uuid: i,
    //   ...getModalInstance({
    //     uuid: i,
    //     title: '更新数据',
    //     children: createForm(keys),
    //   }),
    // });
    // i += 1;
    return instances;
  };
}())
