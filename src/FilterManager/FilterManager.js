import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import FiltersList from './FiltersList';
import FilterObjectClass from './FilterObjectClass';
import './_filterManager.scss';
import useAutoHidePanel from '../AutoHidePanelHook/AutoHidePanelHook';

export const AddFilterButton = ({ fieldsData, returnNewFilter, customFilters }) => {
  const handleNewFilter = () => {
    // Add a new filter and use the first field as initial field
    const initialFieldData = Object.values(fieldsData)[0];
    const { uid, field, type, label } = initialFieldData;
    const newFilter = new FilterObjectClass({
      field: field || uid,
      type,
      label,
      filterOptionId: uid,
      isCustomType: Object.keys(customFilters).indexOf(type) >= 0,
    });
    returnNewFilter(newFilter);
  };

  return (
    <button type="button" className="button-two addFilterBtn" onClick={handleNewFilter}>
      Add Filter
    </button>
  );
};

AddFilterButton.propTypes = {
  returnNewFilter: PropTypes.func.isRequired,
  fieldsData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  customFilters: PropTypes.objectOf(PropTypes.func),
};

AddFilterButton.defaultProps = {
  customFilters: {},
};

/**
 * Filter Manager Panel React Component
 *
 * @param {*} {
 *   filterData,
 *   addFilter, (filterData) => {}
 *   deleteFilter, (index) => {}
 *   updateFilter, (index, newData) => {}
 *   clearFilters, () => {}
 *   showPanelOverride,
 *   fieldsData,
 *   floating,
 *   autoOpenPanel,
 * }
 */
const FilterPanel = ({
  filterData,
  addFilter,
  deleteFilter,
  updateFilter,
  clearFilters,
  showPanelOverride,
  fieldsData,
  floating,
  autoOpenPanel,
  customFilters,
  customFiltersComponents,
}) => {
  const menuRef = useRef(null);
  const [showPanel, setShowPanel] = useAutoHidePanel(menuRef, floating, showPanelOverride);
  // Auto show panel if values change
  useEffect(() => {
    if (filterData && Object.keys(filterData).length > 0) {
      // TODO: Stop if is search string
      if (autoOpenPanel) setShowPanel(true);
    }
  }, [filterData, autoOpenPanel, setShowPanel]);

  const panelClassName = ['filterManager_panel', floating ? 'floating' : ''].join(' ');

  return (
    <div className="filterManager">
      <button
        type="button"
        className="button-one openFiltersButton"
        onClick={() => setShowPanel(!showPanel)}
      >
        Filters
      </button>
      <div
        className={panelClassName}
        ref={menuRef}
        style={{
          display: showPanel ? 'block' : 'none',
        }}
      >
        <FiltersList
          filterData={filterData}
          deleteFilter={(filterIndex) => deleteFilter(filterIndex)}
          updateFilter={(filterIndex, newFilterData) => updateFilter(filterIndex, newFilterData)}
          fieldsData={fieldsData}
          customFilters={customFilters}
          customFiltersComponents={customFiltersComponents}
        />
        <button
          type="button"
          className="button-one"
          onClick={() => {
            clearFilters();
            setShowPanel(false);
          }}
        >
          Clear Filters
        </button>
        <AddFilterButton
          fieldsData={fieldsData}
          returnNewFilter={(newFilterObj) => {
            addFilter(newFilterObj);
          }}
          customFilters={customFilters}
        />
      </div>
    </div>
  );
};

FilterPanel.propTypes = {
  filterData: PropTypes.arrayOf(PropTypes.instanceOf(FilterObjectClass)).isRequired,
  addFilter: PropTypes.func.isRequired,
  deleteFilter: PropTypes.func.isRequired,
  updateFilter: PropTypes.func.isRequired,
  clearFilters: PropTypes.func.isRequired,
  showPanelOverride: PropTypes.bool,
  fieldsData: PropTypes.objectOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
    })
  ).isRequired,
  floating: PropTypes.bool,
  autoOpenPanel: PropTypes.bool,
  customFilters: PropTypes.objectOf(PropTypes.func),
  customFiltersComponents: PropTypes.objectOf(PropTypes.elementType),
};

FilterPanel.defaultProps = {
  showPanelOverride: false,
  floating: false,
  autoOpenPanel: false,
  customFilters: {},
  customFiltersComponents: {},
};

export default FilterPanel;
