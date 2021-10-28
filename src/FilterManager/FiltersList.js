import React from 'react';
import PropTypes from 'prop-types';

import filterTypes from '../FilterTypes';
import FilterDate from './FilterTypes/FilterDate';
import FilterBool from './FilterTypes/FilterBool';
import FilterSelect from './FilterTypes/FilterSelect';
import FilterString from './FilterTypes/FilterString';
import FilterNumber from './FilterTypes/FilterNumber';
import FilterObjectClass from './FilterObjectClass';
import FilterObject from './FilterTypes/FilterObject';

import { switchF } from '../helpers/functionalProgramming';
/**
 * Update the target field fot a filter row
 * @param {number} index
 * @param {string} fieldId the uid of the new field
 * @param {object} fieldsData data on each field type
 * @param {func} updateFilter function to pass new filter data
 */
const updateFieldTarget = (index, fieldId, fieldsData, updateFilter, customFilters) => {
  if (!fieldsData[fieldId]) throw Error('Missing Field Data');
  const { uid, field, type } = fieldsData[fieldId];
  const newFilter = new FilterObjectClass({
    ...fieldsData[fieldId],
    field: field || uid,
    filterOptionId: uid,
    type,
    isCustomType: Object.keys(customFilters).indexOf(type) >= 0,
  });
  updateFilter(index, newFilter);
};

// Map the filters to UI
const FiltersList = ({
  filterData,
  deleteFilter,
  updateFilter,
  fieldsData,
  customFilters,
  customFiltersComponents,
}) => {
  const updateFieldTargetFn = (index, newFieldId) =>
    updateFieldTarget(index, newFieldId, fieldsData, updateFilter, customFilters);
  // for each filter create a row
  const mapFilters =
    filterData &&
    Array.isArray(filterData) &&
    filterData.map((filter, i) => {
      // get filter type from the field type
      const { field: fieldId, type } = filter;
      const fieldData = fieldsData[fieldId];

      const args = {
        key: filter.uid,
        filter,
        updateFilter: (newFilter) => updateFilter(i, newFilter),
        fieldData,
      };

      const filterTypeComponent = switchF(
        type,
        {
          [filterTypes.uid]: () => <FilterString {...args} />,
          [filterTypes.textLong]: () => <FilterString {...args} />,
          [filterTypes.text]: () => <FilterString {...args} />,
          [filterTypes.number]: () => <FilterNumber {...args} />,
          [filterTypes.date]: () => <FilterDate {...args} />,
          [filterTypes.bool]: () => <FilterBool {...args} />,
          [filterTypes.toggle]: () => <FilterBool {...args} />,
          [filterTypes.selectMulti]: () => <FilterSelect {...args} />,
          [filterTypes.select]: () => <FilterSelect {...args} />,
          [filterTypes.embedded]: () => <FilterString {...args} />,
          // TODO:  Image filters may need to be an object search
          [filterTypes.image]: () => <FilterString {...args} />,
          [filterTypes.file]: () => <FilterString {...args} />,
          [filterTypes.fileMultiple]: () => <FilterString {...args} />,
          [filterTypes.reference]: () => <FilterString {...args} />,
          [filterTypes.button]: () => <FilterString {...args} />,
          [filterTypes.selectSearch]: () => <FilterString {...args} />,
          [filterTypes.dict]: () => <FilterObject {...args} />,
          ...Object.entries(customFiltersComponents).reduce((acc, [key, Field]) => {
            acc[key] = () => <Field {...args} />;
            return acc;
          }, {}),
        },
        () => (
          <div key={type || filter} className="invalidFilter">
            Invalid Filter
            {' - '}
            {filter.uid}
            {' - '}
            {type}
          </div>
        )
      );

      return (
        <li className="filterManager_filterItem" key={filter.uid} id={filter.uid}>
          {/* Delete filter button */}
          <button
            type="button"
            className="button-one deleteFilterBtn"
            onClick={() => deleteFilter(i)}
          >
            X
          </button>
          {/* Target field select */}
          <select
            value={filter.filterOptionId || ''}
            onChange={(e) => updateFieldTargetFn(i, e.target.value)}
            className="filterItem_filterFieldSelect"
          >
            {Object.values(fieldsData)
              .filter((f) => !f.noFilter)
              .map((opt) => (
                <option value={opt.uid} key={opt.uid}>
                  {opt.label}
                </option>
              ))}
          </select>
          {/* Filter input */}
          {filterTypeComponent}
        </li>
      );
    });
  return (
    <ul className="filterManager_filterList">
      {mapFilters || 'Invalid Filter Data'}
      {filterData && filterData.length === 0 && 'No filters'}
    </ul>
  );
};

FiltersList.propTypes = {
  filterData: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      field: PropTypes.string.isRequired,
      operator: PropTypes.string,
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    })
  ).isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  fieldsData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      field: PropTypes.string, // default is uid
    })
  ).isRequired,
  customFilters: PropTypes.objectOf(PropTypes.func),
  customFiltersComponents: PropTypes.objectOf(PropTypes.elementType),
};

FiltersList.defaultProps = {
  customFilters: {},
  customFiltersComponents: {},
};

export default FiltersList;
