/**
 * 导出所有对象
 * @param {*} exports 
 * @param {*} path 
 * @param {*} plugins 
 */
function exportPlugins(exports, plugins) {
  plugins.forEach(name => {
    Object.defineProperty(exports, name, {
      configurable: false,
      enumerable: true,
      get() {
        return require(`./${name}`);
      },
    });
  });
}

exportPlugins((exports.optimize = {}), [
  'Row',
  'Col',
  'Input',
  'TextArea',
  'DatePicker',
  'Button',
]);

