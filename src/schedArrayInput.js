import React, { Component } from 'react';
import get from 'lodash/get'
import forEach from 'lodash/forEach'
import sortBy from 'lodash/sortBy'
import extend from 'lodash/extend'
import isFunction from 'lodash/isFunction'
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import TimePicker from 'material-ui/TimePicker';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Chip from 'material-ui/Chip';
import Moment from 'react-moment';
import { FieldArray } from 'redux-form';
import FlatButton from 'material-ui/FlatButton';
import ActionDeleteIcon from 'material-ui/svg-icons/action/delete';
import DatePicker from 'material-ui/DatePicker';
import ReferenceWrap from './referenceWrap'
import { connect } from 'react-redux';
import { crudGetMatching as crudGetMatchingAction } from 'admin-on-rest';

import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn
} from 'material-ui/Table';

const styles = {
  top: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start'
  },
  checkboxgrp: {
    marginLeft: '20px',
    flexBasis: '50%',
    flexGrow: 2
  },
  checkboxInner: {
    display: 'inline-flex',
    flexWrap: 'wrap'
  },
  checkBox: {
    width: '90px'
  },
  timepk: {
    flexBasis: '12%',
    flexGrow: 1
  },
  chip: {
    marginRight: '4px',
    display: 'inline-block',
    paddingRight: '1px'
  },
  tblcol: {
    width: '60px',
    paddingLeft: '10px',
    paddingRight: '10px'
  },
  tbldays: {
    width: '200px'
  }
}

export const DayChipList = ({days}) => {
  const arr = days.map( day => day && (
    <Chip className="DayChip" labelStyle={{textTransform: 'capitalize'}}
      key={day} style={styles.chip}>{daymap.find(v => v.id === day).value}</Chip>
  ));
  return (
    <span>
      {arr}
    </span>
  );
}

export const SchedTable = ({ fields, cols, hideIfEmpty, superHeader, elStyle, children }) => {
  if (hideIfEmpty && fields.length === 0) return null;

  return (
  <Table selectable={false} style={extend({tableLayout: 'auto'}, elStyle)} >
    <TableHeader displaySelectAll={false} adjustForCheckbox={false}>
      {superHeader && (
        <TableRow>
          <TableHeaderColumn colSpan={cols.length + 1} style={{textAlign: 'center'}}>
            {superHeader}
          </TableHeaderColumn>
        </TableRow>
      )}
      <TableRow>
        { cols.map((col, cidx) => <TableHeaderColumn key={cidx} style={col.style}>{col.title}</TableHeaderColumn>)}
        <TableHeaderColumn width='125px'> </TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
      { fields.map( (name, index) => (
        <TableRow key={index}>
          { children.map( (x, cidx) => {
            const elem = React.cloneElement(x, {rec: fields.get(index)});
            return (
              <TableRowColumn key={cidx} style={cols[cidx].style}>
                {elem}
              </TableRowColumn>
            )
          }) }
          <TableRowColumn width='125px'>
            <FlatButton primary label="Remove"
              icon={<ActionDeleteIcon/>}
              onClick={() => fields.remove(index)}
            />
          </TableRowColumn>
        </TableRow>
      ))}
    </TableBody>
  </Table>
  )
}

export class SchedInput extends Component {
  state = {
    freq: '',
    days: [],
    time: null,
    start: null,
    end: null,
    tktid: ''
  }

  handleSelect = (value, name) => {
    this.setState({ [name]: value });
  }
  handleCheck = (ev, ischecked) => {
    const { days } = this.props;
    const sfunc = (o) => get(days.find(v => v.id === o), 'od');
    if (ischecked)
      this.setState({ days: sortBy([...this.state.days, ...[ev.target.id]], sfunc) });
    else
      this.setState({ days: this.state.days.filter( el => el !== ev.target.id ) });
  }

  invalidInput = () => {
    const { freq, time, days, start, end, tktid } = this.state;
    return freq === '' || days.length === 0 || time === null || start === null || end === null || tktid === '';
  }

  render = () => {
    const { choices, days, onAddTime, elStyle, nextid } = this.props;

    const callAdd = () => onAddTime( {id: nextid, ...this.state} ) ;
    return (
      <div className='timeinput' style={elStyle}>
        <div>
          <DatePicker
            style={{display: 'inline-block', paddingRight: '20px'}}
            hintText='Start Date'
            disableYearSelection={true}
            mode='portrait'
            value={this.state.start}
            formatDate={new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long'}).format}
            onChange={(ev, dt) => this.setState({start: dt})}
            minDate={new Date((new Date()).getFullYear(), 0, 1)}
            maxDate={(this.state.end) ? new Date(this.state.end.getTime() - 1000*60*60*24) :  new Date((new Date()).getFullYear(), 11, 30)}
          />
          <DatePicker
            style={{display: 'inline-block', paddingLeft: '20px'}}
            mode='portrait'
            hintText='End Date'
            formatDate={new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long'}).format}
            minDate={(this.state.start) ? new Date(this.state.start.getTime() + 1000*60*60*24) : null }
            maxDate={new Date((new Date()).getFullYear(), 11, 31)}
            onChange={(ev, dt) => this.setState({end: dt})}
          />
        </div>
        <div>
          <SelectField className='freqselect' floatingLabelText='Frequency'
            style={styles.freq} value={this.state.freq}
            onChange={(e,i,v) => this.handleSelect(v, 'freq')}>
            {choices.map( f => (
              <MenuItem key={f.id} value={f.id} primaryText={f.value} />
            ) )}
          </SelectField>
          <ReferenceWrap reference='tickets' source='tktprice'
            propMap={{key: 'id', value: 'id', primaryText: 'name'}}
            options={{ style: {display: 'inline-block', width: '200px', paddingLeft: '40px'},
              onChange: (e,i,v) => this.handleSelect(v, 'tktid'),
              floatingLabelText: 'Ticket Price',
            value: this.state.tktid }}
          />
        </div>
        <div className='container' style={styles.top}>
          <div className='checkboxgrp' style={styles.checkboxgrp}>
            <span className='checkboxInner' style={styles.checkboxInner}>
              {days.map( (day, idx) => (
                <Checkbox key={get(day, 'id')} id={get(day, 'id')}
                  label={get(day, 'value')} style={styles.checkBox} onCheck={this.handleCheck} />
              ))}
            </span>
          </div>
          <TimePicker autoOk={true} pedantic={true} hintText='Start Time' className='timepk'
            onChange={(_, dt) => this.handleSelect(dt, 'time')} style={styles.timepk} textFieldStyle={{width: '100px'}} />
          <FloatingActionButton disabled={this.invalidInput()}
            mini={true} onClick={callAdd}>
            <ContentAdd />
          </FloatingActionButton>
        </div>
      </div>
    );
  }
}

const choicemap = [ { id: 'ev', value: 'Every' }, { id: 'eo', value: 'Every Other' } ];
const daymap = [
  {id: 'sun', value: 'Sun', od: 0},
  {id: 'mon', value: 'Mon', od: 1},
  {id: 'tue', value: 'Tue', od: 2},
  {id: 'wed', value: 'Wed', od: 3},
  {id: 'thu', value: 'Thu', od: 4},
  {id: 'fri', value: 'Fri', od: 5},
  {id: 'sat', value: 'Sat', od: 6}
];

export const TblWrap = ({propMap, rec, children}) => {
  if (isFunction(children)) {
    return <span>{children(rec)}</span>;
  } else {
    let props = {};
    forEach(propMap, (val, key) => {
      props[key] = rec[val];
    });
    return React.cloneElement(children, {...props});
  }
}

const validArray = value => value && value.length ? undefined : "Must have at least one schedule";

class SchedList extends Component {
  state = {
    open: false,
    snackMessage: ''
  }

  componentWillMount() {
    this.props.crudGetMatching('tickets', 'schedtickets', { page: 1, perPage: 30 }, { field: 'id', order: 'ASC'}, {});
  }

  renderList = ({ fields, meta }) => {
    const { elStyle, refs } = this.props;
    console.log(fields);

    const cols = [
      {title: 'Start', style: styles.tblcol},
      {title: 'End', style: styles.tblcol},
      {title: 'Frequency', style: styles.tblcol},
      {title: 'Days', style: styles.tbldays},
      {title: 'Start Time', style: styles.tblcol},
      {title: 'Ticket Pricing', style: styles.tblcol}
    ];

    return (
      <div className="EmbeddedTest" style={elStyle}>
        {meta.submitFailed && (
          <p style={{color: '#F44336', fontSize: '12px', lineHeight: '12px'}}>{meta.error}</p>
        )}
        <SchedInput choices={choicemap} days={daymap}
          onAddTime={(data) => { fields.push(data) }} nextid={fields.length} />
        <SchedTable fields={fields} cols={cols} hideIfEmpty={true} superHeader='Date and Time Table'>
          <TblWrap propMap={{date: 'start' }}>
            <Moment format='MMM Do' />
          </TblWrap>
          <TblWrap propMap={{date: 'end' }}>
            <Moment format='MMM Do' />
          </TblWrap>
          <TblWrap>
            {(rec) => choicemap.find(f => f.id === rec.freq).value }
          </TblWrap>
          <TblWrap propMap={{days: 'days'}}>
            <DayChipList />
          </TblWrap>
          <TblWrap propMap={{date: 'time'}}>
            <Moment format='h:mm A' />
          </TblWrap>
          <TblWrap>
            {(rec) => {
              if (refs[rec.tktid]) {
                return refs[rec.tktid].name;
              }
              return null;
            }}
          </TblWrap>
        </SchedTable>
      </div>
    );
  }

  render() {
    const { source } = this.props;

    return (
      <div>
        <FieldArray name={source} component={this.renderList} validate={validArray} />
      </div>
    );
  }
}

const mapStateToProps = (state, props) => {
  return {
    refs: state.admin.tickets.data
  }
}

export default connect(mapStateToProps, {crudGetMatching: crudGetMatchingAction})(SchedList);
