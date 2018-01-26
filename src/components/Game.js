let knightPosition = [1, 4];
let observer = null;

const components = [];

function emitChange() {
  observer(components);
}

export function observe(o) {
  if (observer) {
    throw new Error('Multiple observers not implemented.');
  }

  observer = o;
  emitChange();
}

export function canMoveKnight(toX, toY) {
  const [x, y] = knightPosition;
  const dx = toX - x;
  const dy = toY - y;

  return (Math.abs(dx) === 2 && Math.abs(dy) === 1) ||
         (Math.abs(dx) === 1 && Math.abs(dy) === 2);
}

export function moveKnight(toX, toY) {
  knightPosition = [toX, toY];
  emitChange();
}

let currentComponent = null;

/**
 * 保存当前正在拖动的节点
 * @param {*} component 
 */
export function saveComponent(component) {
  currentComponent = component;
  components.push(component);
  emitChange();
}

/** 
 * 获取当前正在拖动的节点
 */
export function fetchComponent() {
  return currentComponent;
}
