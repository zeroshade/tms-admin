import React, { Component } from 'react';
import get from 'lodash/get'
import sortBy from 'lodash/sortBy'
import SelectField from 'material-ui/SelectField';
import Checkbox from 'material-ui/Checkbox';
import TimePicker from 'material-ui/TimePicker';
import MenuItem from 'material-ui/MenuItem';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Snackbar from 'material-ui/Snackbar';
import Chip from 'material-ui/Chip';
import Moment from 'react-moment';
import { FieldArray } from 'redux-form';
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
    margin: '4px',
    display: 'inline-block',
    padding: '1px'
  }
}

export const SchedTable = ({ fields, choices, daymap }) => (
  <Table selectable={false} style={{tableLayout: 'auto'}}>
    <TableHeader displaySelectAll={false} adjustforCheckbox={false}>
      <TableRow>
        <TableHeaderColumn>Frequency</TableHeaderColumn>
        <TableHeaderColumn width={'40%'}>Days</TableHeaderColumn>
        <TableHeaderColumn>Start Time</TableHeaderColumn>
      </TableRow>
    </TableHeader>
    <TableBody displayRowCheckbox={false}>
      { fields.map( (name, index) => (
        <TableRow key={index}>
          <TableRowColumn>{choices.find( f => f.id === fields.get(index).freq).value}</TableRowColumn>
          <TableRowColumn width={'40%'}>
            {fields.get(index).days.map( day => day && (
              <Chip className="DayChip" labelStyle={{textTransform: 'capitalize'}}
                    key={day} style={styles.chip}>{daymap.find(v => v.id === day).value}</Chip>
            ))}
          </TableRowColumn>
          <TableRowColumn>
            <Moment date={fields.get(index).time} format='h:mm A' />
          </TableRowColumn>
        </TableRow>
      ))}
    </TableBody>
  </Table>
)

export class SchedInput extends Component {
  state = {
    id: 0,
    freq: '',
    days: [],
    time: null,
    open: false,
    snackMessage: ''
  }

  handleTime = (_, dt) => {
    this.setState({time: dt});
  }
  handleChange = (ev, idx, value) => {
    this.setState({freq: value});
  }
  handleCheck = (ev, ischecked) => {
    const { days } = this.props;
    const sfunc = (o) => get(days.find(v => v.id === o), 'od');
    if (ischecked)
      this.setState({ days: sortBy([...this.state.days, ...[ev.target.id]], sfunc) });
    else
      this.setState({ days: this.state.days.filter( el => el !== ev.target.id ) });
  }
  handleAdd = (onAddTime) => {
    const { freq, id, time, days } = this.state;
    const launchSnack = (msg) => this.setState({ snackMessage: msg, open: true });
    if (freq === '') {
      launchSnack('Must choose a frequency');
      return;
    }
    if (days.length === 0) {
      launchSnack('Must have at least one day checked');
      return;
    }
    if (time === null) {
      launchSnack('Must choose a time');
      return;
    }

    onAddTime({id, time, freq, days});
    this.setState({id: id + 1});
  }

  invalidInput = () => {
    const { freq, time, days} = this.state;
    return freq === '' || days.length === 0 || time === null;
  }

  render = () => {
    const { choices, days, onAddTime, elStyle } = this.props;
    const callAdd = () => onAddTime( (({id, time, freq, days}) => ({id, time, freq, days}))(this.state) );
    return (
      <div className='timeinput' style={elStyle}>
        <div className='container' style={styles.top}>
          <SelectField className='freqselect' floatingLabelText='Frequency'
            style={styles.freq} value={this.state.freq} onChange={this.handleChange}>
            {choices.map( f => (
              <MenuItem key={f.id} value={f.id} primaryText={f.value} />
            ) )}
          </SelectField>
          <div className='checkboxgrp' style={styles.checkboxgrp}>
            <span className='checkboxInner' style={styles.checkboxInner}>
              {days.map( (day, idx) => (
                <Checkbox key={get(day, 'id')} id={get(day, 'id')}
                  label={get(day, 'value')} style={styles.checkBox} onCheck={this.handleCheck} />
              ))}
            </span>
          </div>
          <TimePicker autoOk={true} pedantic={true} hintText='Start Time' className='timepk'
                      onChange={this.handleTime} style={styles.timepk} textFieldStyle={{width: '100px'}} />
          <FloatingActionButton disabled={this.invalidInput()}
                                mini={true} onClick={callAdd}>
            <ContentAdd />
          </FloatingActionButton>
          <Snackbar open={this.state.open} message={this.state.snackMessage} autoHideDuration={4000}
              onRequestClose={() => this.setState({ open: false })} />
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

class SchedList extends Component {
  renderList = ({ fields }) => {
    const { elStyle } = this.props;

    return (
      <div className="EmbeddedTest" style={elStyle}>
        <SchedInput choices={choicemap} days={daymap}
          onAddTime={(data) => { fields.push(data) }} />
        {fields.length !== 0 &&
          <SchedTable fields={fields} choices={choicemap} daymap={daymap} />
        }
      </div>
    )
  }

  render() {
    const { source } = this.props;
    return (
      <div>
        <FieldArray name={source} component={this.renderList} />
      </div>
    );
  }
}

export default SchedList;
