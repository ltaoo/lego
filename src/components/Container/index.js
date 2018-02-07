/**
 * @file 组件编辑预览
 * @author wuya
 */
import React from 'react';

import Field from '../Field';
import EventEmitter from '../../common/emitter';
import { updateProps } from '../../common/util';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      instances: [],
      currentInstance: {},
    };
  }
  componentDidMount() {
    EventEmitter.on('addComponent', (obj) => {
      const { instances, currentInstance } = this.state;
      // 如果是布局组件
      if (currentInstance.layout) {
        currentInstance.children = currentInstance.children || [];
        currentInstance.children.push(obj);
      } else {
        instances.push(obj);
      }
      this.setState({
        instances: [...instances],
      });
    });
    EventEmitter.on('updateComponent', (item, values) => {
      const { instances } = this.state;
      const { uuid } = item;
      const { fieldProps: newFieldProps, props: newProps } = values;

      // 递归寻找 uuid 对应的那个实例对象并更新 fieldProps 和 props
      updateProps(uuid, instances, newFieldProps, newProps);
    });
  }
  /**
   * 删除指定组件
   */
  removeComponent = item => {
    const { components } = this.state;
    const index = components.indexOf(item);
    components.splice(index, 1);
    const codeObj = this.code;
    this.setState(
      {
        components: [...components],
      },
      () => {
        delete codeObj[item.uuid];
        const code = this.createSource();
        this.setState({
          code,
        });
      },
    );
  };
  /**
   * 切换容器
   */
  switchContainer = (item, checked) => {
    console.log(item, checked);
    this.setState({
      currentInstance: checked ? item : {},
    });
  };
  /**
   * 渲染实例组件
   */
  renderComponent = () => {
    const { instances } = this.state;
    return instances.map((instance) => {
      return (
        <Field
          key={instance.uuid}
          item={instance}
          // 用在获取嵌套组件代码的时候，只当 root === true 时才获取代码
          root
          removeComponent={this.removeComponent}
          switchContainer={this.switchContainer}
        />
      );
    });
  };

  render() {
    const fields = this.renderComponent();
    return <div>{fields}</div>;
  }
}

export default Container;
