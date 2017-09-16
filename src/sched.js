import React, { Component } from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import { SchedTable } from './schedArrayInput';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import { FieldArray } from 'redux-form';
import DatePicker from 'material-ui/DatePicker';
import Moment from 'react-moment';
import { TblWrap } from './schedArrayInput';

class DateArrayInput extends Component {
  state = {
    curDate: null
  }
  render = () => {
    const { onAdd } = this.props;

    return (
      <span>
        <DatePicker
          style={{display: 'inline-block'}}
          hintText='Exclude Date'
          disableYearSelection={true}
          mode='landscape'
          value={this.state.curDate}
          formatDate={new Intl.DateTimeFormat('en-US', { day: 'numeric', month: 'long'}).format}
          onChange={(ev, dt) => this.setState({curDate: dt})} />
        <FloatingActionButton mini={true}
          disabled={!this.state.curDate}
          style={{marginLeft: '30px', marginTop: '4px'}}
          onClick={() => onAdd({curDate: this.state.curDate})}>
          <ContentAdd />
        </FloatingActionButton>
      </span>
    )
  }
}

export class DateTable extends Component {
  renderList = ({ fields }) => {
    const { style, elStyle, superTitle } = this.props;

    const cols = [
      {title: 'Date', style: {} }
    ];

    return (
      <div className="dateTbl" style={style}>
        <DateArrayInput onAdd={(data) => { fields.push(data) }} elStyle={elStyle} />
        <SchedTable fields={fields} cols={cols} elStyle={elStyle} hideIfEmpty={true} superHeader={superTitle}>
          <TblWrap propMap={{date: 'curDate'}}>
            <Moment format='MMMM Do' />
          </TblWrap>
        </SchedTable>
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

export default DateTable;

const Sched = ({input, meta: { touched, error } }) => (
  <SelectField
    {...input}
    onChange={(_, value) => {input.value = value}}
    value={input.value || 'EV'}
    floatingLabelText="Freq"
    errorText={touched && error}
  >
    <MenuItem value="EV" primaryText="Every" />
    <MenuItem value="EO" primaryText="Every Other" />
    <MenuItem value="EF" primaryText="Every First" />
    <MenuItem value="ET" primaryText="Every Third" />
  </SelectField>
);
Sched.defaultProps = {
  addField: true
}
