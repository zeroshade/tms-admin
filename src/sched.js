import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

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
export default Sched;
