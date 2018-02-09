# 可视化页面搭建

为什么要做这个东西，https://ltaoo.github.io/2018/02/09/%E5%8F%AF%E8%A7%86%E5%8C%96%E5%B8%83%E5%B1%80/

## 源对象

位于`src/source/lib`下的每个文件，都导出了一个对象，这个对象的结构如下：

```javascript
enum SourceObj {
  // antd 组件
  Component,
  // 组件名
  label,
  // 在最终生成的代码 import { xx } from 'antd' 处使用
  import,
  // 在最终生成的代码 import 下方，正文上方使用
  extra,
  // 标志该组件是否为表单，影响编辑组件属性时的模态框
  notfield,
  // 出现在 constructor 函数内的代码
  constructorCode,
  // 就这个意思
  methods,
  // 会被添加到组件上的属性
  props,
}
```

最终生成的代码只从该对象得到，逻辑位于`src/common/create-source.js`。

## 对象实例

在选择组件后，会生成一个新的对象，该对象仅仅在`SourceObj`上添加`uuid`属性，

```javascript
enum SourceInstance {
  uuid,
  // ...
}
```

## 组件

```
|-------------|------------|
|                          |
|      App                 |
|                          |
| |---------||-----------| |
| |         ||           | |
| | Source  || Container | |
| |         ||           | |
| |---------||-----------| |
|                          |
|-----------|--------------|
```

最顶层的组件是`App`，`Source`提供对象实例，`Container`负责渲染组件并提供编辑功能。

### Source

路径为`src/components/Sources`，点击生成对象实例，并传给`App`组件。

### App

路径为`src/App.js`，掌控一切，在`state`中维护了一个`instances`数组，存放所有的对象实例。

### Container

路径为`src/components/Container`，说这个是掌控一切或许更加合理，内部都是`Field`组件。

### Field

路径为`src/components/Field`，该组件是实际看到的，不仅是`antd`组件本身，还有编辑按钮，编辑表单等，对组件的编辑都会反映到实例对象上。

最终生成的代码和该组件没有关系，代码只和实例对象有关。
