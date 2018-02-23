import * as lib from '../components/Sources/lib';

import store from '../store';
import { ADD_COMPONENT } from './actions';

const COMPONENT_MAP = {};
for (let key in lib.optimize) {
  COMPONENT_MAP[key] = lib.optimize[key].default;
}

let uuid = 1;
export default function addComponent(tag) {
  // 新增组件
  const instance = {
    uuid,
    tag,
    ...COMPONENT_MAP[tag]({
      uuid,
    }),
  };

  uuid += 1;
  // 啊啊啊，这里不应该这么 low
  if (tag === 'Upload') {
    // 1 是给 Upload 里面的 Button
    uuid += 1;
  }
  return instance;
}
