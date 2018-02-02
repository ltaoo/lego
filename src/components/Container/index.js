/**
 * @file 预览区
 * @author ltaoo<litaowork@aliyun.com>
 */
import React from 'react';

import Field from '../Field';
import EventEmitter from '../../common/emitter';

class Container extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      objs: [],
      currentObj: null,
    };
  }
  componentDidMount() {
    EventEmitter.on('addComponent', (obj) => {
      const { objs, currentObj } = this.state;
      // 如果是布局组件
      console.log(currentObj);
      if (currentObj && currentObj.container === 'true') {
        currentObj.children = currentObj.children || [];
        currentObj.children.push(obj);
      } else {
        objs.push(obj);
      }
      this.setState({
        objs: [...objs],
      });
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
    this.setState({
      currentObj: checked ? item : this,
    });
  };
  /**
   * 渲染实例
   * @param {Object} item - 包装实例
   * @param {Component} item.Component - antd 组件
   * @param {Object} item.props - 会被添加到 Component 实例上的属性
   */
  renderComponent = item => {
    const { objs } = this.state;
    return objs.map((item, i) => {
      return (
        <Field
          key={i}
          item={item}
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
