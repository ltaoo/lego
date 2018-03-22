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
  // 这里的会作为每个被导入的 key
  'Row',
  'Col',
  'Card',
  'Divider',
  'Input',
  'TextArea',
  'Select',
  'Cascader',
  'DatePicker',
  'CheckboxGroup',
  'RadioGroup',
  'Switch',
  'Upload',
  'Button',
  'Table',
  'Modal',
]);

