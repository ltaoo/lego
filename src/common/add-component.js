import * as lib from '../components/Sources/lib';

import EventEmitter from './emitter';

const COMPONENT_MAP = {};
for (let key in lib.optimize) {
  COMPONENT_MAP[key] = lib.optimize[key].default;
}

let uuid = 1;
export default function addComponent(tag) {
  console.log(tag);
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
  EventEmitter.emit('addComponent', instance);
}
