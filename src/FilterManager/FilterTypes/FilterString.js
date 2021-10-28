import React from 'react';
import PropTypes from 'prop-types';
import FilterObjectClass from '../FilterObjectClass';
import comparisons from '../../FilterTypes/comparisons';

const FilterString = ({ filter, updateFilter }) => {
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
      value: e.target.value || '',
    });
    updateFilter(newFilterData);
  };

  return (
    <>
      <select value={filter.operator} onChange={updateOperator} className="filterOperatorSelect">
        <option value={comparisons.regex}>contains</option>
        <option value={comparisons.equals}>is exactly</option>
        <option value={comparisons.empty}>is empty</option>
      </select>
      <input
        type="text"
        className="filterInput"
        value={filter.value}
        onChange={updateValue}
        disabled={filter.operator === comparisons.empty}
      />
    </>
  );
};

FilterString.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.string,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterString;
