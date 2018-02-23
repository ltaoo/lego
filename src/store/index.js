import { createStore } from 'redux';

import * as t from '../common/actions';
import { updateProps, removeComponent } from '../common/util';

const initialState = {
  instances: [],
  currentInstance: {},
};

function reducer(state = initialState, action) {
  const { instances, currentInstance } = state;
  switch (action.type) {
    case t.ADD_COMPONENT:
      const { payload: obj } = action;
      // 如果是布局组件
      if (currentInstance.layout) {
        currentInstance.children = currentInstance.children || [];
        currentInstance.children.push(obj);
      } else {
        instances.push(obj);
      }
      return {
        ...state,
        instances,
      };
    case t.UPDATE_COMPONENT:
      const {
        item,
        values,
      } = action.payload;
      let { uuid } = item;
      // 递归寻找 uuid 对应的那个实例对象并更新 fieldProps 和 props
      updateProps(uuid, [...instances], values);
      return {
        ...state,
        instances,
      };
    case t.REMOVE_COMPONENT:
      uuid = action.payload.uuid;
      const temp = [...instances];
      removeComponent(uuid, temp);
      return {
        ...state,
        instances: temp,
      };
    default:
      return state;
  }
}

let store = createStore(reducer);

export default store;
