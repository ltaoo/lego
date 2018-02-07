const cache = {};

/**
 * 监听事件
 * @param {*} type 
 */
function on(type, fn) {
    cache[type] = fn;
}
/**
 * 触发事件
 * @param {*} type 
 * @param {*} val 
 */
function emit(type, ...args) {
    const fn = cache[type];
    if (fn) {
        fn.apply(null, args);
    }
}

export default {
    on,
    emit,
};
