import React from 'react';
import PropTypes from 'prop-types';
import FilterObjectClass from '../FilterObjectClass';
import comparisons from '../../FilterTypes/comparisons';

const FilterDate = ({ filter, updateFilter }) => {
  const updateOperator = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      operator: e.target.value,
    });
    updateFilter(newFilterData);
  };

  const updateValue = (e) => {
    const newFilterData = new FilterObjectClass({
      ...filter,
      value: new Date(e.target.value).toISOString().substr(0, 10),
    });
    updateFilter(newFilterData);
  };

  const parsedDate =
    filter.value instanceof Date
      ? filter.value.toISOString().substr(0, 10)
      : new Date(filter.value).toISOString().substr(0, 10);

  return (
    <>
      <select value={filter.operator} onChange={updateOperator} className="filterOperatorSelect">
        <option value={comparisons.equals}>=</option>
        <option value={comparisons.after}>After</option>
        <option value={comparisons.before}>Before</option>
      </select>
      <input
        className="filterInput"
        type="date"
        value={filter.value ? parsedDate : ''}
        onChange={updateValue}
      />
    </>
  );
};

FilterDate.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.instanceOf(Date),
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterDate;
