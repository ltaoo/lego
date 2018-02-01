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
function emit(type, val) {
    const fn = cache[type];
    if (fn) {
        fn.call(null, val);
    }
}

export default {
    on,
    emit,
};
