import React from 'react';
import moment from 'moment';
import { Form, Button, Row, Col, Input, Select, Icon, InputNumber, DatePicker } from 'antd';
import {guid, ContentTip} from './common';
import PanelCtrl from './PanelCtrl';

import styles from './style.less';

const FormItem = Form.Item;
const {Option} = Select;

const empty = () => {};

const filterOption = (input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0;

const relationExtend = [{dbval: 'and', dispval: '且'}, {dbval: 'or', dispval: '或'}]; // 支持的关系类型

const matchExtend = [ // 支持的操作符
  { key: '=', name: '等于', getValue: (key, value) => [key, '=', isNaN(value) ? `'${value}'` : value]},
  { key: 'like', name: '模糊', getValue: (key, value) => [key, 'like', `'%${value}%'`]},
  { key: '<', name: '小于', getValue: (key, value) => [key, '<', isNaN(value) ? `'${value}'` : value]},
  { key: '>', name: '大于', getValue: (key, value) => [key, '>', isNaN(value) ? `'${value}'` : value]},
  { key: '<=', name: '小于等于', getValue: (key, value) => [key, '<=', isNaN(value) ? `'${value}'` : value]},
  { key: '>=', name: '大于等于', getValue: (key, value) => [key, '>=', isNaN(value) ? `'${value}'` : value]},
  { key: 'empty', name: '空值', getValue: (key) => [key, '=', "''"], nouse: true},
  { key: 'unempty', name: '非空', getValue: (key) => [key, '<>', "''"], nouse: true},
  { key: 'null', name: '无值', getValue: (key) => [key, 'is', 'null'], nouse: true},
  { key: 'unnull', name: '有值', getValue: (key) => [key, 'is', 'not null'], nouse: true},
  { key: 'emptyAndNull', name: '空类型', getValue: (key) => ['(', key, '=', "''", 'or', key, 'is', 'null', ')'], nouse: true},
  { key: 'unemptyAndNull', name: '非空类型', getValue: (key) => ['(', key, '<>', "''", 'and', key, 'is', 'not null', ')'], nouse: true},
];

const fieldType = { // 支持的类型
  getType(obj) {
    if (obj.values.length > 0) return 'dropdown';
    switch (obj.esritype) {
      case 'esriFieldTypeOID':
      case 'esriFieldTypeSmallInteger':
      case 'esriFieldTypeInteger':
        return 'int';
      case 'esriFieldTypeDate':
        return 'date';
      default:
        return 'string';
    }
  },
  string: {
    match: ['=', 'like', 'emptyAndNull', 'unemptyAndNull'],
    getForm(fld, value, required, edite, props) {
      const {alias} = fld;
      return {
        initialValue: value,
        rules: [{required, message: edite && `${alias}必须输入!`}],
        component: <Input placeholder={edite && `请输入${alias}` || '<空>'} disabled={!edite} {...props} />,
      };
    },
  },
  int: {
    match: ['=', '<', '>', '<=', '>=', 'emptyAndNull', 'unemptyAndNull'],
    getForm(fld, value, required, edite, props) {
      const {alias} = fld;
      return {
        initialValue: value,
        rules: [{required, message: `${alias}必须输入!`}],
        component: <InputNumber placeholder={edite && `请输入${alias}` || '<空>'} disabled={!edite} style={{width: '100%'}} {...props} />,
      };
    },
  },
  dropdown: {
    match: ['=', 'like', 'emptyAndNull', 'unemptyAndNull'],
    getForm(fld, value, required, edite, props) {
      const {alias, values} = fld;
      return {
        initialValue: value,
        rules: [{required, message: `${alias}必须选择!`}],
        component: (
          <Select placeholder={edite && `请选择${alias}` || '<空>'} disabled={!edite} {...props} showSearch filterOption={filterOption}>{values.map((obj, i) => <Option key={`${i * 1}`} value={obj.dbval}>{obj.dispval}</Option>)}</Select>
        ),
      };
    },
  },
  date: {
    match: ['=', '<', '>', '<=', '>=', 'emptyAndNull', 'unemptyAndNull'],
    getForm(fld, value, required, edite, props) {
      const {alias} = fld;
      return {
        initialValue: value && moment(value.replace(/-/g, '/'), 'YYYY/MM/DD hh:mm:ss') || undefined,
        rules: [{required, message: `${alias}必须输入!`}],
        component: <DatePicker style={{width: '100%'}} disabled={!edite} showTime format="YYYY-MM-DD HH:mm:ss" {...props} />,
      };
    },
  },
};

function Mvvm () {
  const {form: {getFieldDecorator, setFieldsValue}} = this.props;

  const getValues = (arr) => (typeof arr[0] === 'string' ? arr.map(x => ({dbval: x, dispval: x})) : arr);

  const getMatch = (type) => {
    const {match = []} = fieldType[type] || {};
    const temp = match.map(x => {
      const [obj] = matchExtend.filter(y => x === y.key);
      return obj && {dbval: obj.key, dispval: obj.name};
    }).filter(x => x);
    return temp.length > 0 ? temp : [{dbval: '=', dispval: '等于'}];
  };

  const getVaildFields = (fields) => {
    const flds = fields.filter(x => /[\u4e00-\u9fa5]/.test(x.alias));
    return flds.length < 1 ? fields : flds;
  };

  const getFields = (fields) => {
    const relation = {type: 'dropdown', alias: '关系', values: relationExtend};
    const field = {type: 'dropdown', alias: '字段', values: fields.map(x => ({dbval: x.name, dispval: x.alias}))};
    const items = fields.reduce((a, b) => Object.assign(a, {[b.name]: fieldType.getType(b)}), {});
    const values = fields.reduce((a, b) => Object.assign(a, {[b.name]: getValues(b.values || [])}), {});
    return {
      getRelation() { return relation; },
      getField() { return field; },
      getType(fld) { return items[fld] || 'string'; },
      getMatch(fld) { return {type: 'dropdown', alias: '匹配', values: getMatch(items[fld])}; },
      getValue(fld) { return {type: items[fld] || 'string', alias: '字段值', values: values[fld] || [] }; },
    };
  };

  const getFormItem = (field, key, value, item, edite, props) => {
    const {type} = item;
    const {rules, initialValue, component} = fieldType[type].getForm(item, value, edite, edite, props);
    return <FormItem>{getFieldDecorator(`${field}_${key}`, {initialValue, rules})(component)}</FormItem>;
  };

  const onRelationRender = ({field, item, idx, edite}) => {
    if (idx > 0) return getFormItem(field, item.key, 'and', item.getRelation(item.field), edite);
    return <div className={styles.fileForm_filter}><Icon type="filter" /></div>;
  };

  const onFieldRender = ({field, item, edite}) => {
    const onChange = (value) => { onChangeField({field, key: item.key, value}); };
    return getFormItem(field, item.key, undefined, item.getField(item.field), edite, {onChange});
  };

  const onMatchRender = ({field, item, edite}) => {
    const onChange = (value) => { onChangeMatch({field, key: item.key, value, type: item.getType(item.field)}); };
    return getFormItem(field, item.key, '=', item.getMatch(item.field), edite, {onChange});
  };

  const onValueRender = ({field, item, edite}) => {
    const {valueEdite, type, match} = item;
    if (!valueEdite) return <div className={styles.fileForm_unuse}>无需输入</div>;
    if (type === 'dropdown' && match === 'like') return getFormItem(field, item.key, undefined, {type: 'string', alias: '字段值'}, edite);
    return getFormItem(field, item.key, undefined, item.getValue(item.field), edite);
  };

  const onDeleteRender = ({item, edite}) => {
    const {key} = item;
    return <Button disabled={!edite} style={{margin: '4px 0'}} icon="delete" type="primary" onClick={() => delItem(key)} />;
  };

  const onChangeField = ({key, field, value}) => {
    const {items} = this.state;
    const [{nouse = false} = {}] = matchExtend.filter(x => x.key === '=');
    items.filter(x => x.key === key).forEach(item => Object.assign(item, {[field]: value, valueEdite: !nouse, match: '='}));
    this.setState(items, () => setFieldsValue({[`match_${key}`]: '=', [`value_${key}`]: undefined}));
  };

  const onChangeMatch = ({key, field, value, type}) => {
    const {items} = this.state;
    const [{nouse = false} = {}] = matchExtend.filter(x => x.key === value);
    items.filter(x => x.key === key).forEach(item => Object.assign(item, {[field]: value, valueEdite: !nouse, type}));
    this.setState(items, () => {
      if (type === 'dropdown' && value === '=') setFieldsValue({[`value_${key}`]: undefined});
    });
  };

  const addItem = () => {
    const {items} = this.state;
    const {mateFields} = this.props;
    this.setState({items: items.concat({key: guid(), ...getFields(getVaildFields(mateFields)), valueEdite: true})});
  };

  const delItem = (key) => {
    const {items} = this.state;
    this.setState({items: items.filter(x => x.key !== key)});
  };

  const validateFields = (e) => {
    return new Promise((resolve, reject) => {
      const {form} = this.props;
      form.validateFields((err, values) => {
        e.preventDefault();
        if (!err) {
          const {items = []} = this.state;
          const errors = [];
          const getItem = ({key}) => {
            const [relation = '', field, match, value] = [values[`relation_${key}`], values[`field_${key}`], values[`match_${key}`], values[`value_${key}`]];
            const [obj] = matchExtend.filter(x => x.key === match);
            if (obj) return [relation].concat(obj.getValue(field, value && typeof value.format === 'function' ? `${value.format('YYYY-MM-DD HH:mm:ss')}` : value));
            else { errors.push(match); return []; }
          };
          const dates = items.map(getItem);
          const temps = errors.filter((v, i, a) => a.indexOf(v) === i);
          if (temps.length > 0) reject(new Error(`没有定义${temps.join('、')}的解析器`));
          else resolve(dates);
        } else reject(err);
      });
    });
  };

  const clearAll = () => {
    this.setState({items: []});
  };

  const onSubmit = (e) => {
    const {onSubmit: submit} = this.props;
    validateFields(e).then(submit);
  };

  const columns = {
    gutter: 8,
    fields: [
      {name: '关系', field: 'relation', span: 3, render: onRelationRender},
      {name: '字段', field: 'field', span: 6, render: onFieldRender },
      {name: '匹配', field: 'match', span: 4, render: onMatchRender},
      {name: '字段值', field: 'value', span: 9, render: onValueRender},
      {name: '删除', field: 'delete', span: 2, nouse: true, render: onDeleteRender},
    ],
  };

  const initState = () => {
    Object.assign(this, {addItem, clearAll, validateFields});
  };

  const state = {
    columns,
    items: [],
    evts: {onSubmit},
  };

  this.setState(state, initState);
}

@Form.create()
export default class Control extends React.Component {
  componentWillMount() { this::Mvvm(); }
  render() {
    const {columns: {gutter, fields}, items = [], evts: {onSubmit = empty}} = this.state;
    const {edite = false} = this.props;
    return (
      <PanelCtrl
        header={(
          <div className={styles.fileForm_header}>
            {<Row gutter={gutter}>{fields.map(({name, field, span}) => <Col key={field} span={span}>{name}</Col>)}</Row>}
          </div>
        )}
      >
        <Form style={{height: '100%'}} onSubmit={onSubmit}>
          <div className={styles.fileForm}>
            {
              Array.isArray(items) && items.length > 0 ? items.map((item, idx) => {
                const {key} = item;
                return (
                  <Row gutter={gutter} key={key}>
                    { fields.map(({render, field, span}) => <Col key={field} span={span}>{render({field, item, idx, edite})}</Col>)}
                  </Row>
                );
              }) : <ContentTip msg="请添加条件" />
            }
          </div>
        </Form>
      </PanelCtrl>
    );
  }
}
