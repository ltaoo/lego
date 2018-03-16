/**
 * @file 组件属性编辑组件
 * @author wuya
 */
import React, { Component } from 'react';
import { Row, Col, Divider, Icon, Input, InputNumber, Button, Radio, Checkbox, Switch } from 'antd';

import Form from "react-jsonschema-form";

import { createSchemaByDefaultValue } from '../../common/util';

const { Item: FormItem } = Form;
const { Group: RadioGroup } = Radio;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 18 },
  },
};

class Editor extends Component {
  constructor(props) {
    super(props);

    const { instance } = props;
    const { options, columns } = instance;
    this.state = {
      options,
      columns,
    };
  }
  /**
   * 移除 option
   */
  remove = (i) => {
    const { options } = this.state;
    options.splice(i, 1);
    this.setState({
      options: [...options],
    });
  }
  /**
   * 新增 option
   */
  add = () => {
    const { options } = this.state;
    this.setState({
      initialValue: [],
      options: [
        ...options,
        {
          label: '',
          value: '',
        },
      ],
    });
  }
  /**
   * 移除 option
   */
  removeColumn = (i) => {
    const { columns } = this.state;
    columns.splice(i, 1);
    this.setState({
      columns: [...columns],
    });
  }
  /**
   * 新增 option
   */
  addColumn = () => {
    const { columns } = this.state;
    this.setState({
      columns: [
        ...columns,
        {
          title: '',
          key: '',
        },
      ],
    });
  }
  /**
   * 提交表单更新组件
   */
  handleClick = () => {
    const { submit, form } = this.props;
    const { initialValue } = this.state;
    const { getFieldsValue } = form;
    const values = getFieldsValue();
    // 处理下 rules
    if (values.fieldProps) {
      values.fieldProps.rules = values.fieldProps.rules.filter(rule => {
        const keys = Object.keys(rule);
        return rule[keys[0]] && rule[keys[1]];
      });
    }
    if (initialValue) {
      values.fieldProps.initialValue = initialValue;
    }
    submit(values);
  };
  /**
   * 渲染 instanceObj 中 props
   */
  renderCommonInput = () => {
    const { form, instance } = this.props;
    const { getFieldDecorator } = form;
    const { Component, props } = instance;
    const { propTypes } = Component;

    const mergedProps = Object.assign({}, propTypes, props);
    const formItems = [];
    let i = 0;
    for (let key in mergedProps) {
      const val = mergedProps[key];
      if (val) {
        if (typeof val === 'string') {
          formItems.push(
            <FormItem key={i} label={key}>
              {getFieldDecorator(`props.${key}`, {
                initialValue: mergedProps[key],
              })(<Input />)}
            </FormItem>
          );
        } else if (typeof val === 'boolean') {
          const options = [
            {
              label: '是',
              value: 0,
            }, {
              label: '否',
              value: 1,
            },
          ];
          formItems.push(
            <FormItem key={i} label={key}>
              {getFieldDecorator(`props.${key}`, {
              })(<RadioGroup options={options} />)}
            </FormItem>
          );
        } else if (typeof val === 'number') {
          formItems.push(
            <FormItem key={i} label={key}>
              {getFieldDecorator(`props.${key}`, {
                initialValue: val,
              })(<InputNumber />)}
            </FormItem>
          );
        }
      }
      
      i += 1;
    }
    return formItems;
  };

  /**
   * 表单字段相关的如 title、label、initialValue、rules等
   */
  renderFieldInputs = () => {
    const { form, instance } = this.props;
    const { getFieldDecorator } = form;
    const { isField, fieldProps, label: Tag } = instance;

    if (!isField) {
      return null;
    }

    const {
      title,
      label,
      initialValue,
      // 布局相关
      labelCol,
      wrapperCol,
    } = fieldProps;

    const obj = {
      title,
      label,
      initialValue,
    };

    const fields = ['title', 'label', 'initialValue'];
    let _i = 0;
    const temp = fields.map((field, i) => {
      _i = i;
      let input = <Input />;
      if (field === 'initialValue' && (Tag === 'Select' || Tag === 'RadioGroup')) {
        input = <InputNumber />
      }
      return <FormItem key={i} label={field}>
        {getFieldDecorator(`fieldProps.${field}`, {
          initialValue: obj[field],
        })(input)}
      </FormItem>
    });
    temp.push((
      <FormItem key={_i++} label="labelCol">
        {getFieldDecorator(`fieldProps.labelCol.span`, {
          initialValue: labelCol.span,
        })(<InputNumber />)}
      </FormItem>
    ));
    temp.push((
      <FormItem key={_i++} label="wrapperCol">
        {getFieldDecorator(`fieldProps.wrapperCol.span`, {
          initialValue: wrapperCol.span,
        })(<InputNumber />)}
      </FormItem>
    ));
    return temp;
  }

  /** 
   * 渲染校验字段
   */
  renderValidateInputs = () => {
    const { instance, form } = this.props;
    const { getFieldDecorator } = form;

    const MAP = ['Input', 'InputNumber'];
    const items = (
      <div>
        <Row gutter={8}>
          <Col span={6}>
            <FormItem label="是否必选">
              {getFieldDecorator('fieldProps.rules[0].required', {
                initialValue: false,
              })(<Switch />)}
            </FormItem>
          </Col>
          <Col span={18}>
            <FormItem label="提示文案">
              {getFieldDecorator('fieldProps.rules[0].message', {
              })(<Input />)}
            </FormItem>
          </Col>
        </Row>
        { MAP.indexOf(instance.label) > -1 && 
          <Row>
            <Col span={6}> 
              <FormItem label="最大值/长度">
                {getFieldDecorator('fieldProps.rules[1].max', {
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem label="提示文案">
                {getFieldDecorator('fieldProps.rules[1].message', {
                  initialValue: '请检查输入的长度',
                })(<Input />)}
              </FormItem>
            </Col>
            <Col span={6}>
              <FormItem label="最小值/长度">
                {getFieldDecorator('fieldProps.rules[2].min', {
                })(<InputNumber />)}
              </FormItem>
            </Col>
            <Col span={18}>
              <FormItem label="提示文案">
                {getFieldDecorator('fieldProps.rules[2].message', {
                  initialValue: '请检查输入的长度',
                })(<Input />)}
              </FormItem>
            </Col>
          </Row>
        }
      </div>
    );
    return items;
  }
  /**
   * 选择 option 作为默认项
   */
  handleChecked = (option, e) => {
    const { checked } = e.target;
    const { initialValue = [] } = this.state;
    if (checked) {
      this.setState({
        initialValue: initialValue.concat([option.value]),
      });
    } else {
      this.setState({
        initialValue: initialValue.filter(item => item !== option.value),
      });
    }
  }
  /**
   * 单选，Select 或者 Radio
   */
  selectSingle = (option, e) => {
    console.log(option, e);
  }
  /** 
   * 渲染 options
   * @param {Array} options - 要渲染的项
   * @param {boolean} child - 是否是子项（改变样式）
   */
  renderOptions = (options, child, parentIndex, extra = '') => {
    const { instance } = this.props;
    const { getFieldDecorator } = this.props.form;
    const style = child ? { marginLeft: 20 } : {};
    const existOptions = options.map((option, i) => {

      let baseId = `options`;
      let extraText = `[${i}]${extra}`;
      // 没想明白
      if (child) {
        extraText = extra;
      }

      baseId = baseId + extraText;
      const valueId = `${baseId}.value`;
      const labelId = `${baseId}.label`;

      // let defaultValueInput = <Radio onChange={this.selectSingle.bind(this, option)} />
      let defaultValueInput = null;
      if (instance.label === 'CheckboxGroup') {
        defaultValueInput = <Checkbox onChange={this.handleChecked.bind(this, option)} />;
      }

      return (
        <div key={i} gutter={14} style={style}>
          <Col span={2}>
            <FormItem>
              {defaultValueInput}
            </FormItem>
          </Col>
          <Col span={8}>
            <FormItem label="label" {...formItemLayout}>
              {getFieldDecorator(labelId, {
                initialValue: option.label,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={14}>
            <FormItem label="value" {...formItemLayout}>
              {getFieldDecorator(valueId, {
                initialValue: option.value,
              })(<InputNumber />)}
              <Icon
                className="dynamic-delete-button"
                style={{ marginLeft: 20 }}
                type="minus-circle-o"
                onClick={this.remove.bind(this, i)}
              />
            </FormItem>
          </Col>
          {option.children && this.renderOptions(option.children, true, i, `${extraText}.children[0]`)}
        </div>
      );
    });
    return existOptions;
  }
  /** 
   * 渲染 options
   * @param {Array} options - 要渲染的项
   * @param {boolean} child - 是否是子项（改变样式）
   */
  renderColumns = (columns, child, parentIndex, extra = '') => {
    const { getFieldDecorator } = this.props.form;
    const style = child ? { marginLeft: 20 } : {};
    const existOptions = columns.map((option, i) => {

      let baseId = `columns`;
      let extraText = `[${i}]${extra}`;
      // 没想明白
      if (child) {
        extraText = extra;
      }

      baseId = baseId + extraText;
      const valueId = `${baseId}.title`;
      const labelId = `${baseId}.key`;
      return (
        <div key={i} gutter={14} style={style}>
          <Col span={8}>
            <FormItem label="title" {...formItemLayout}>
              {getFieldDecorator(valueId, {
                initialValue: option.title,
              })(<Input />)}
            </FormItem>
          </Col>
          <Col span={16}>
            <FormItem label="key" {...formItemLayout}>
              {getFieldDecorator(labelId, {
                initialValue: option.dataIndex,
              })(<Input style={{ width: 120 }} />)}
              <Icon
                className="dynamic-delete-button"
                style={{ marginLeft: 20 }}
                type="minus-circle-o"
                onClick={this.removeColumn.bind(this, i)}
              />
            </FormItem>
          </Col>
          {option.children && this.renderColumns(option.children, true, i, `${extraText}.children[0]`)}
        </div>
      );
    });
    return existOptions;
  }

  handleSubmit = (data) => {
    this.props.submit(data);
  }

  render() {
    const { 
      field, 
      props, 
      mergedProps,
      uiSchema,
    } = this.props.instance;
    let defaultValue = {
      props,
    };
    if (field) {
      defaultValue.field = field;
    }
    if (mergedProps) {
      defaultValue = {
        ...defaultValue,
        mergedProps,
      }
    }
    const schema = createSchemaByDefaultValue(defaultValue);
    return (
      <div className="editor__form">
        <Form 
          schema={schema} 
          uiSchema={uiSchema} 
          onSubmit={this.handleSubmit}
        />
      </div>
    );
  }
}

export default Editor;
