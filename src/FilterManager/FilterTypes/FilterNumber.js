import React from 'react';
import PropTypes from 'prop-types';
import FilterObjectClass from '../FilterObjectClass';
import comparisons from '../../FilterTypes/comparisons';

const FilterNumber = ({ filter, updateFilter }) => {
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
      value: parseFloat(e.target.value || 0),
    });
    updateFilter(newFilterData);
  };

  return (
    <>
      <select value={filter.operator} onChange={updateOperator} className="filterOperatorSelect">
        <option value={comparisons.equals}>=</option>
        <option value={comparisons.greaterThan}>{'>'}</option>
        <option value={comparisons.lesserThan}>{'<'}</option>
      </select>
      <input className="filterInput" type="number" value={filter.value} onChange={updateValue} />
    </>
  );
};

FilterNumber.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterNumber;
