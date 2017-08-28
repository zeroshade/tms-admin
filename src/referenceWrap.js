import React, { Component } from 'react';
import { connect } from 'react-redux';
import mapValues from 'lodash/mapValues';
import { crudGetMatching as crudGetMatchingAction } from 'admin-on-rest';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const referenceSource = (resource, source) => `${resource}@${source}`;

export class LogTicketIds extends Component {
  constructor(props) {
    super(props);
    const { perPage, sort, filter } = props;
    this.params = { pagination: { page: 1, perPage }, sort, filter };
  }

  componentDidMount() {
    const {reference, source, resource} = this.props;
    const { pagination, sort, filter } = this.params;

    this.props.crudGetMatching(reference, referenceSource(resource, source), pagination, sort, filter);
  }

  render() {
    const { matchingReferences, propMap, options } = this.props;
    return (
      <SelectField {...options} >
        {matchingReferences.map( rec => <MenuItem {...mapValues(propMap, f => rec[f])} />)}
      </SelectField>
    )
  }
};

LogTicketIds.defaultProps = {
  addField: true,
  allowEmpty: false,
  filter: {},
  matchingReferences: [],
  perPage: 25,
  sort: { field: 'id', order: 'DESC' },
  resource: 'tickets',
  reference: 'tickets',
  referenceRecord: null
};

export const getPossible = (state, refsrc, ref) => {
  const possible = state.admin.references.possibleValues[refsrc]
          ? Array.from(state.admin.references.possibleValues[refsrc]) : [];
  return possible.map(id => state.admin[ref].data[id]);
}

const mapStateToProps = (state, props) =>  {
  const referenceId = props.value;
  return {
    referenceRecord: state.admin[props.reference].data[referenceId],
    matchingReferences: getPossible(state, referenceSource(props.reference, props.source), props.reference)
  };
}

export default connect(mapStateToProps, {
  crudGetMatching: crudGetMatchingAction
})(LogTicketIds);
