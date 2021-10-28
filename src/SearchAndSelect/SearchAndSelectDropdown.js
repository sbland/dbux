import React, { useEffect, useMemo, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import './_searchAndSelectDropDown.scss';
import FilterObjectClass from '../FilterManager/FilterObjectClass';
import filterTypes from '../../GenericConstants/filterTypes';
import comparisons from '../../GenericConstants/comparisons';
import useAsyncRequest from '../AsyncRequestManager';
import { useSelectionManager } from './logic';
import CustomSelectDropdown from '../CustomSelectDropdown/CustomSelectDropdown';
import LoadingIcon from '../LoadingIcon/LoadingIcon';

/**
 * Search and Select Dropdown Component
 * Dropdown selection with async data load

 */

const SearchAndSelectDropdown = ({
  searchFunction,
  handleSelect,
  selectionOverride: intitialValue,
  allowMultiple,
  returnFieldOnSelect, // the field in the data to return
  searchFieldTargetField, // the target field that the search string applies to
  labelField, // The field in the returned data to use as the label
  className,
  searchFieldPlaceholder,
  allowEmptySearch,
  searchDelay,
}) => {
  // TODO: Provide default search function
  // const [activeFilters, setActiveFilters] = useState(initialFilters || []);
  const [searchValue, setSearchValue] = useState(
    (intitialValue && intitialValue[searchFieldTargetField]) || ''
  );
  const [isFocused, setIsFocused] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const firstItemRef = useRef(null);
  const searchFieldRef = useRef(null);
  const searchTimeout = useRef(null);

  const callOnInit = allowEmptySearch || intitialValue;
  const {
    response: results,
    reload,
    loading,
    // hasLoaded,
    // error,
  } = useAsyncRequest({
    args: [],
    callFn: searchFunction,
    callOnInit,
  });

  useEffect(() => {
    /* Force Reload if search function changes */
    if (callOnInit && searchFunction && (searchValue || allowEmptySearch)) {
      reload([]);
    }
  }, [callOnInit, searchFunction, reload, searchValue, allowEmptySearch]);

  const {
    handleItemSelect,
    currentSelection,
    currentSelectionUid,
    currentSelectionLabels,
    // selectAll,
    // clearSelection,
  } = useSelectionManager({
    results,
    returnFieldOnSelect,
    allowMultiple,
    selectionOverride: intitialValue !== null ? [intitialValue] : null,
    handleSelect,
    liveUpdate: true,
  });

  const onSearchFieldChange = (e) => {
    setSearchValue(e.target.value);
    setShowResults(true);
  };

  useEffect(() => {
    if ((searchValue || allowEmptySearch) && isFocused) {
      const searchFilter = new FilterObjectClass({
        uid: 'search',
        field: searchFieldTargetField,
        value: searchValue,
        operator: comparisons.contains,
        type: filterTypes.text,
      });
      clearTimeout(searchTimeout.current);
      const args = searchValue ? [searchFilter] : [];
      searchTimeout.current = setTimeout(() => reload([args]), searchDelay);
    }
    return () => {
      clearTimeout(searchTimeout.current);
    };
  }, [searchValue, reload, searchFieldTargetField, allowEmptySearch, isFocused, searchDelay]);

  const goBackToSearchField = () => searchFieldRef.current.select();

  const mappedResults = useMemo(() => {
    if (Array.isArray(labelField)) {
      return Array.isArray(results)
        ? results.map((r) => ({
            uid: r.uid,
            label: labelField.map((L) => r[L]).join(' | '),
          }))
        : [];
    }
    return Array.isArray(results)
      ? results.map((r) => ({
          uid: r.uid,
          label: r[labelField],
        }))
      : [];
  }, [labelField, results]);

  const handleListItemSelect = (uid) => {
    if (!loading) {
      handleItemSelect(uid);
      setShowResults(false);
      if (allowMultiple) {
        setSearchValue('');
      } else {
        setSearchValue(results.find((r) => r.uid === uid)[labelField]);
      }
      goBackToSearchField();
    }
  };

  const handleBlur = () => {
    // if (!currentSelection || currentSelection.length === 0) setSearchValue('');
    // else setSearchValue(currentSelection[0][labelField]);
    setShowResults(false);
    setIsFocused(false);
    if (allowMultiple) {
      handleSelect(currentSelection && currentSelection[returnFieldOnSelect], currentSelection);
    } else {
      handleSelect(
        currentSelection[0] && currentSelection[0][returnFieldOnSelect],
        currentSelection[0]
      );
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setShowResults(true);
    }
    if (e.key === 'Escape' || e.key === 'Tab') {
      handleBlur();
    }
    if (e.key === 'ArrowDown') {
      if (mappedResults && mappedResults.length > 0) {
        e.preventDefault();
        if (showResults && !loading) {
          firstItemRef.current.focus();
        } else {
          setShowResults(true);
        }
      }
    }
  };

  const valid = useMemo(
    () =>
      currentSelection &&
      currentSelection.length > 0 &&
      currentSelection[0][labelField] === searchValue,
    [currentSelection, searchValue, labelField]
  );

  const classNames = [className, 'sas_drop_wrap', valid ? '' : 'invalid']
    .filter((a) => a)
    .join(' ');

  return (
    <div className={classNames}>
      <div className="searchFieldWrap">
        <input
          className="searchField"
          style={{ flexGrow: 1 }}
          type="text"
          placeholder={searchFieldPlaceholder}
          value={searchValue || ''}
          onChange={onSearchFieldChange}
          onFocus={() => setIsFocused(true)}
          // onBlur={() => handleBlur()}
          onKeyDown={handleInputKeyDown}
          ref={searchFieldRef}
        />
        <button
          type="button"
          className="dropdownBtn"
          onClick={() => setShowResults((prev) => !prev)}
        >
          \/
        </button>
      </div>
      <div className="selectedItemsWrap">
        {allowMultiple &&
          currentSelectionLabels &&
          currentSelectionLabels.map((item, i) => (
            <button
              type="button"
              key={item}
              className="button-one searchSelectedItem"
              onClick={() => handleListItemSelect(currentSelectionUid[i])}
            >
              {item}
            </button>
          ))}
      </div>
      <div className="">
        <LoadingIcon isLoading={loading} />
      </div>
      <CustomSelectDropdown
        options={mappedResults}
        isOpen={showResults}
        handleSelect={(uid) => handleListItemSelect(uid)}
        handleClose={() => setShowResults(false)}
        firstItemRef={firstItemRef}
        goBackToSearchField={goBackToSearchField}
      />
    </div>
  );
};

const selectionShape = {};

SearchAndSelectDropdown.propTypes = {
  searchFunction: PropTypes.func.isRequired,
  handleSelect: PropTypes.func.isRequired,
  selectionOverride: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.shape(selectionShape)),
    PropTypes.shape(selectionShape),
  ]),
  allowMultiple: PropTypes.bool,
  returnFieldOnSelect: PropTypes.string,
  searchFieldTargetField: PropTypes.string,
  labelField: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)])
    .isRequired,
  className: PropTypes.string,
  searchFieldPlaceholder: PropTypes.string,
  allowEmptySearch: PropTypes.bool,
  searchDelay: PropTypes.number,
};

SearchAndSelectDropdown.defaultProps = {
  selectionOverride: null,
  allowMultiple: false,
  returnFieldOnSelect: 'uid',
  searchFieldTargetField: 'label',
  className: '',
  searchFieldPlaceholder: 'search...',
  allowEmptySearch: false,
  searchDelay: 500,
};

export default SearchAndSelectDropdown;
