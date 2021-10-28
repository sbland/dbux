import React from 'react';
// import renderer from 'react-test-renderer';
import { shallow, mount } from 'enzyme';
import cloneDeep from 'lodash/cloneDeep';

import FilterManager, { AddFilterButton } from './FilterManager';
import FilterString from './FilterTypes/FilterString';
import FilterNumber from './FilterTypes/FilterNumber';

import { demoFiltersData, demoFieldsData } from './demoData';
import FilterObjectClass from './FilterObjectClass';
import filterTypes from '../../GenericConstants/filterTypes';
import comparisons from '../../GenericConstants/comparisons';
import FiltersList from './FiltersList';

const addFilter = jest.fn();
const deleteFilter = jest.fn();
const updateFilter = jest.fn();
const clearFilters = jest.fn();

const defaultProps = {
  filterData: demoFiltersData,
  addFilter,
  deleteFilter,
  updateFilter,
  clearFilters,
  showPanelOverride: true,
  fieldsData: demoFieldsData,
  floating: false,
  autoOpenPanel: false,
  customFilters: { hello: () => {} },
  customFiltersComponents: { hello: () => {} },
};

describe('FilterManager', () => {
  it('Renders', () => {
    shallow(<FilterManager {...defaultProps} />);
  });
  it('Matches Snapshot', () => {
    const component = mount(<FilterManager {...defaultProps} />);
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });

  let demoFiltersCopy = cloneDeep(demoFiltersData);
  describe('filters', () => {
    const setFilterDataFunc = jest.fn();
    let filterManager;
    beforeEach(() => {
      filterManager = mount(<FilterManager {...defaultProps} />);
      updateFilter.mockClear();
      deleteFilter.mockClear();
      addFilter.mockClear();
      clearFilters.mockClear();
    });
    afterEach(() => {
      setFilterDataFunc.mockClear();
      demoFiltersCopy = cloneDeep(demoFiltersData);
    });

    describe('Edit Filter', () => {
      let filterList;
      beforeEach(() => {
        filterList = filterManager.find('.filterManager_filterList');
      });
      it('Shows a filter for each filter item', () => {
        const filterCount = demoFiltersCopy.length;
        expect(filterList.find('.filterManager_filterItem').length).toEqual(filterCount);
      });

      it('Entering text into a string filter will update the value in the filter data', () => {
        const filterInput = filterList.find(FilterString).first().find('.filterInput');
        const newVal = 'efg';
        filterInput.simulate('change', { target: { value: newVal } });
        // expect(activeFilterData.demoFilterString.value).toEqual(newVal);
        const newFilterData = demoFiltersCopy;
        newFilterData[0].value = newVal;
        expect(updateFilter).toHaveBeenCalledWith(0, newFilterData[0]);
      });

      it('Entering text into a number filter will update the value in the filter data', () => {
        const filterInput = filterList.find(FilterNumber).first().find('.filterInput');
        const newVal = 3;
        filterInput.simulate('change', { target: { value: newVal } });
        const newFilterData = demoFiltersCopy;
        newFilterData[1].value = newVal;
        expect(updateFilter).toHaveBeenCalledWith(1, newFilterData[1]);
      });
      ('');
      it('Changing the filter operator dropdown updates the operator', () => {
        const filterSelect = filterList.find(FilterNumber).first().find('.filterOperatorSelect');
        const newOperator = comparisons.equals;
        filterSelect.simulate('change', { target: { value: newOperator } });
        const newFilterData = demoFiltersCopy;
        newFilterData[1].operator = newOperator;
        expect(updateFilter).toHaveBeenCalledWith(1, newFilterData[1]);
      });

      it('shows the correct field value in the field dropdown', () => {
        const filterNumber = filterList
          .find('.filterManager_filterItem')
          .filter({ id: 'demoFilterNumber' });
        const fieldDropdown = filterNumber.find('.filterItem_filterFieldSelect');
        expect(fieldDropdown.props().value).toEqual('count');
      });
    });

    describe('using filterOptionId', () => {
      test('should update a filter that has a different filterOptionId and field', () => {
        const fieldsData = {
          filterA: {
            uid: 'filterA',
            field: 'fieldA',
            label: 'Field A',
            type: filterTypes.text,
          },
          filterB: {
            uid: 'filterB',
            field: 'fieldA',
            label: 'Field A copy',
            type: filterTypes.text,
          },
        };
        filterManager = mount(
          <FilterManager
            {...defaultProps}
            filterData={[]}
            showPanelOverride
            fieldsData={fieldsData}
          />
        );

        const addFilterButton = filterManager.find('.addFilterBtn');
        addFilterButton.simulate('click');
        filterManager.update();
        const filterData = [
          new FilterObjectClass({
            operator: comparisons.contains,
            field: 'fieldA',
            filterOptionId: 'filterA',
            label: 'Field A',
            type: filterTypes.text,
            uid: expect.any(String),
            value: '',
          }),
        ];
        expect(addFilter).toHaveBeenCalledWith(filterData[0]);
        filterManager.setProps({ filterData });
        const filterList = filterManager.find(FiltersList);
        expect(filterList.props().filterData).toEqual(filterData);
        let filterFieldSelect = filterList.find('.filterItem_filterFieldSelect').first();
        filterFieldSelect.simulate('change', { target: { value: 'filterB' } });
        filterManager.update();
        const updatedFilterData = [
          new FilterObjectClass({
            operator: 'contains',
            field: 'fieldA',
            filterOptionId: 'filterB',
            label: 'Field A copy',
            type: 'text',
            uid: expect.any(String),
            value: '',
          }),
        ];
        expect(updateFilter).toHaveBeenCalledWith(0, updatedFilterData[0]);
        filterManager.setProps({ filterData: updatedFilterData });
        filterFieldSelect = filterManager.find('.filterItem_filterFieldSelect').first();
        expect(filterFieldSelect.props().value).toEqual('filterB');
      });
    });

    describe('Filter Types', () => {
      let component;
      let fieldsData;
      let filterData;
      beforeAll(() => {
        // create filterdata
        filterData = Object.keys(filterTypes).map(
          (key) =>
            new FilterObjectClass({
              uid: key,
              field: key,
              value: 0,
              operator: comparisons.greaterThan,
              type: key,
            })
        );

        fieldsData = {};
        Object.keys(filterTypes).forEach((key) => {
          fieldsData[key] = {
            uid: key,
            label: key,
            type: key,
          };
        });

        component = mount(
          <FilterManager {...defaultProps} filterData={filterData} fieldsData={fieldsData} />
        );
      });

      // TODO: Fix these tests
      test('Contains filter for all filter types', () => {
        const filterCount = filterData.length;
        expect(component.find('.filterManager_filterItem').length).toEqual(filterCount);
        expect(component.find('.invalidFilter').length).toEqual(0);
      });
    });

    describe('Delete Filter', () => {
      filterManager = mount(
        <FilterManager
          {...defaultProps}
          filterData={demoFiltersCopy}
          showPanelOverride
          fieldsData={demoFieldsData}
        />
      );

      test('Deletes filter on delete btn press', () => {
        const filterList = filterManager.find('.filterManager_filterList');
        const deleteBtn = filterList.find('.deleteFilterBtn').first();
        deleteBtn.simulate('click');
        expect(deleteFilter).toHaveBeenCalledWith(0);
      });
    });
    describe('Add Filter', () => {
      filterManager = mount(<FilterManager {...defaultProps} />);
      test('Add filter on add btn press', () => {
        const addFilterBtn = filterManager.find(AddFilterButton).first();
        const newFilterData = new FilterObjectClass({ ...demoFiltersCopy[0] });
        addFilterBtn.props().returnNewFilter(newFilterData);
        filterManager.update();
        expect(addFilter).toHaveBeenCalled();
        const newFilter = addFilter.mock.calls[0][0];
        expect(newFilter instanceof FilterObjectClass).toBeTruthy();
        expect(newFilter).toEqual(newFilterData);
      });
    });
  });
  describe('Add Filter Button Component', () => {
    test('should render', () => {
      shallow(<AddFilterButton fieldsData={demoFieldsData} returnNewFilter={() => {}} />);
    });
    test('should match snapshot', () => {
      const returnNewFilterFn = jest.fn();
      const component = shallow(
        <AddFilterButton fieldsData={demoFieldsData} returnNewFilter={returnNewFilterFn} />
      );
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
    test('should return a new filter when we click add filter btn', () => {
      const returnNewFilterFn = jest.fn();
      const component = mount(
        <AddFilterButton fieldsData={demoFieldsData} returnNewFilter={returnNewFilterFn} />
      );
      const addBtn = component.find('button');
      addBtn.simulate('click');
      expect(returnNewFilterFn).toHaveBeenCalled();
      expect(returnNewFilterFn.mock.calls[0] instanceof FilterObjectClass);
      expect(returnNewFilterFn).toHaveBeenCalledWith(
        new FilterObjectClass({
          field: 'name',
          label: 'Name',
          value: '',
          operator: comparisons.contains,
          type: filterTypes.text,
          uid: expect.any(String),
          filterOptionId: 'name',
        })
      );
    });
  });
  describe('Filter List', () => {
    let component;
    let hiddenField;
    beforeEach(() => {
      updateFilter.mockClear();
      hiddenField = {
        uid: 'hiddenField',
        noFilter: true,
      };
      const FiltersListDefaultProps = {
        filterData: [...demoFiltersData],
        deleteFilter,
        updateFilter,
        fieldsData: { ...demoFieldsData, hiddenField },
        customFilters: {},
      };
      component = mount(<FiltersList {...FiltersListDefaultProps} />);
    });
    test('should hide filters that have the no filter prop', () => {
      const firstItem = component.find('.filterManager_filterItem').first();
      const selectFilter = firstItem.find('.filterItem_filterFieldSelect');
      const options = selectFilter.children().map((c) => c.props().value);
      expect(options.indexOf(Object.values(demoFieldsData)[0].uid)).toBeGreaterThan(-1);
      expect(options.indexOf(hiddenField.uid)).toEqual(-1);
    });
    test('should update filter correctly', () => {
      const newFilterField = demoFieldsData.count;

      const updateFilterSelect = component.find('.filterItem_filterFieldSelect').first();
      updateFilterSelect.simulate('change', { target: { value: newFilterField.uid } });
      component.update();
      expect(updateFilter).toHaveBeenCalledWith(
        0,
        new FilterObjectClass({
          field: newFilterField.uid,
          type: newFilterField.type,
          label: newFilterField.label,
          operator: comparisons.equals,
          filterOptionId: newFilterField.uid,
          value: 0,
          uid: expect.any(String),
        })
      );
    });
  });
  describe('updating filters', () => {
    //
  });
  describe('custom filters', () => {
    const customFilter = jest.fn();
    const CustomFilterComponent = () => <div>Custom Filter</div>;
    const customFilters = { customFilter };
    const customFiltersComponents = { customFilter: CustomFilterComponent };
    const fieldsData = {
      ...demoFieldsData,
      customField: { uid: 'customField', type: 'customFilter', label: 'Custom field' },
    };
    let filterManager;
    beforeEach(() => {
      filterManager = mount(
        <FilterManager
          {...defaultProps}
          customFilters={customFilters}
          fieldsData={fieldsData}
          customFiltersComponents={customFiltersComponents}
        />
      );
      updateFilter.mockClear();
      deleteFilter.mockClear();
      addFilter.mockClear();
      clearFilters.mockClear();
      customFilter.mockClear();
    });
    test('should pass custom filters to filter list component', () => {
      const filterList = filterManager.find(FiltersList);
      expect(filterList.props().customFilters).toEqual(customFilters);
      expect(filterList.props().customFiltersComponents).toEqual(customFiltersComponents);
    });
    test('should be able to call update filter with custom filter', () => {
      const filterFieldSelect = filterManager.find('.filterItem_filterFieldSelect').first();
      filterFieldSelect.simulate('change', { target: { value: 'customField' } });
      expect(updateFilter).toHaveBeenCalledWith(
        0,
        new FilterObjectClass({
          operator: '=',
          field: 'customField',
          type: 'customFilter',
          uid: 'customField',
          label: 'Custom field',
          value: '',
        })
      );
    });

    test('should allow adding a custom filter to the filter list', () => {
      let customFilterComponent = filterManager.find(CustomFilterComponent);
      expect(customFilterComponent.exists()).not.toBeTruthy();
      filterManager.setProps({
        filterData: [
          new FilterObjectClass({
            operator: '=',
            field: 'customField',
            type: 'customFilter',
            uid: 'customField',
            label: 'Custom field',
            value: '',
          }),
        ],
      });
      filterManager.update();
      customFilterComponent = filterManager.find(CustomFilterComponent);
      expect(customFilterComponent.exists()).toBeTruthy();
    });
    test.skip('should check that a non standard field type has an associated custom filter', () => {
      //
    });
    test.skip('should pass custom filters to filter manager', () => {
      //
    });
  });
});
