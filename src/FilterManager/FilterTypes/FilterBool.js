import React from 'react';
import PropTypes from 'prop-types';
import ToggleBox from '../../FormComponents/ToggleBox';
import FilterObjectClass from '../FilterObjectClass';
import comparisons from '../../FilterTypes/comparisons';

const FilterBool = ({ filter, updateFilter }) => {
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
      value: e,
    });
    updateFilter(newFilterData);
  };

  return (
    <>
      <select value={filter.operator} onChange={updateOperator} className="filterOperatorSelect">
        {/* eslint-disable-next-line react/jsx-boolean-value */}
        <option value={comparisons.equals}>Is</option>
      </select>
      <ToggleBox
        stateIn={filter.value}
        text={filter.value ? 'True' : 'False'}
        onChange={updateValue}
      />
    </>
  );
};

FilterBool.propTypes = {
  filter: PropTypes.shape({
    uid: PropTypes.string.isRequired,
    field: PropTypes.string.isRequired,
    operator: PropTypes.string,
    value: PropTypes.bool,
  }).isRequired,
  updateFilter: PropTypes.func.isRequired,
};

export default FilterBool;
