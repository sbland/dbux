import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import FilterManager from './FilterManager';
import { demoFiltersData, demoFieldsData } from './demoData';
import filterTypes from '../../GenericConstants/filterTypes';
import FilterObjectClass from './FilterObjectClass';

storiesOf('Filter Manager', module)
  .add('with text', () => {
    const [filters, setFilters] = useState(demoFiltersData);

    const addFilter = (filterData) => {
      setFilters((prev) => {
        console.log(filterData);
        return prev.concat(filterData);
      });
    };
    const deleteFilter = (filterId) => {
      setFilters((prev) => {
        console.log(filterId);
        const newFilters = prev;
        return newFilters.filter((f, i) => i !== filterId);
      });
    };
    const updateFilter = (filterId) => {
      setFilters((prev) => {
        const newFilters = prev;
        return newFilters;
      });
    };
    const clearFilters = () => {
      setFilters(() => {
        const newFilters = [];
        return newFilters;
      });
    };

    return (
      <div
        style={{
          height: '400px',
        }}
      >
        <FilterManager
          filterData={filters}
          showPanelOverride
          fieldsData={demoFieldsData}
          addFilter={addFilter}
          deleteFilter={deleteFilter}
          updateFilter={updateFilter}
          clearFilters={clearFilters}
        />
        {JSON.stringify(filters)}
      </div>
    );
  })
  .add('All types', () => {
    const fieldsData = {};
    Object.keys(filterTypes).forEach((key) => {
      fieldsData[key] = {
        uid: key,
        label: key,
        type: key,
      };
    });
    const [filters, setFilters] = useState(
      Object.keys(filterTypes).map(
        (key) =>
          new FilterObjectClass({
            uid: key,
            field: key,
            value: 0,
            expression: '',
            type: key,
          })
      )
    );

    return (
      <div
        style={{
          height: '400px',
        }}
      >
        <FilterManager
          filterData={filters}
          setFilterData={setFilters}
          showPanelOverride
          fieldsData={fieldsData}
        />
        {JSON.stringify(filters)}
      </div>
    );
  });
