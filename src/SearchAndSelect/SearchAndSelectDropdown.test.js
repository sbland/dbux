import React from 'react';
import { mount, shallow } from 'enzyme';
import { MockEs6, MockReactC } from '../../Helpers/testing';

import SearchAndSelectDropdown from './SearchAndSelectDropdown';
import { demoResultData } from './inputDataShapes';

import useAsyncRequest from '../AsyncRequestManager';
import CustomSelectDropdown from '../CustomSelectDropdown/CustomSelectDropdown';
import FilterObjectClass from '../FilterManager/FilterObjectClass';
import comparisons from '../../GenericConstants/comparisons';
import filterTypes from '../../GenericConstants/filterTypes';
import { useSelectionManager } from './logic';

jest.useFakeTimers();
jest.mock('../AsyncRequestManager', () => MockEs6('AsyncRequestManager'));
jest.mock('../CustomSelectDropdown/CustomSelectDropdown', () => MockReactC('CustomSelectDropdown'));
jest.mock('../LoadingIcon/LoadingIcon', () => MockReactC('LoadingIcon'));
jest.mock('../LoadingIcon/LoadingIcon', () => MockReactC('LoadingIcon'));
jest.mock('./logic', () => ({
  useSelectionManager: jest.fn(),
}));

const searchFunction = jest
  .fn()
  .mockImplementation(
    async () => new Promise((resolve) => setTimeout(() => resolve(demoResultData), 3000))
  );

const handleSelect = jest.fn();
const handleItemSelect = jest.fn();
const asyncSearchCall = jest.fn();

const returnFieldOnSelect = 'name';
const labelField = 'label';
const defaultProps = {
  searchFunction,
  handleSelect,
  labelField,
  debug: true,
  searchFieldTargetField: 'label',
  allowMultiple: false,
  selectionOverride: null,
  returnFieldOnSelect,
};

const defaultAsyncHookReturn = {
  reload: asyncSearchCall,
  loading: false,
  response: null,
};

const defaultAsyncHookReturnLoaded = {
  reload: asyncSearchCall,
  loading: false,
  response: demoResultData,
};

const defaultSelectionManagerReturn = {
  handleItemSelect,
  currentSelection: demoResultData[0][returnFieldOnSelect],
  currentSelectionUid: demoResultData[0].uid,
  currentSelectionLabels: demoResultData[0][labelField],
  selectAll: jest.fn(),
  clearSelection: jest.fn(),
};

describe('SearchAndSelectDropdown', () => {
  beforeEach(() => {
    setTimeout.mockClear();
    useSelectionManager.mockClear().mockReturnValue(defaultSelectionManagerReturn);
    handleSelect.mockClear();
    handleItemSelect.mockClear();
    asyncSearchCall.mockClear();
    useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturn);
  });
  test('Renders', () => {
    shallow(<SearchAndSelectDropdown {...defaultProps} />);
  });
  describe('shallow renders', () => {
    test('Matches Snapshot', () => {
      const component = shallow(<SearchAndSelectDropdown {...defaultProps} />);
      const tree = component.debug();
      expect(tree).toMatchSnapshot();
    });
  });
  describe('Unit tests', () => {
    let component;
    beforeEach(() => {
      component = mount(<SearchAndSelectDropdown {...defaultProps} />);
    });
    const modifySearchInput = (c, searchVal) => {
      const searchField = component.find('.searchField');
      searchField.simulate('focus');
      component.update();
      searchField.simulate('change', { target: { value: searchVal } });
      component.update();
    };

    describe('defaults', () => {
      test('should call async search fn when we modify the search input', () => {
        setTimeout.mockClear();
        expect(asyncSearchCall).not.toHaveBeenCalled();
        const searchVal = 'searchVal';
        modifySearchInput(component, searchVal);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        jest.runOnlyPendingTimers();
        expect(asyncSearchCall).toHaveBeenCalledWith([
          [
            new FilterObjectClass({
              uid: 'search',
              field: 'label',
              value: searchVal,
              operator: comparisons.contains,
              type: filterTypes.text,
            }),
          ],
        ]);
      });

      test('should not call async search fn when we modify the search input to empty', () => {
        setTimeout.mockClear();
        expect(asyncSearchCall).not.toHaveBeenCalled();
        const searchVal = '';
        modifySearchInput(component, searchVal);
        jest.runOnlyPendingTimers();
        expect(asyncSearchCall).not.toHaveBeenCalled();
      });

      test('should pass results to custom select dropdown', () => {
        useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturnLoaded);
        component.setProps();
        const customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().options).toEqual(
          demoResultData.map((r) => ({ label: r.label, uid: r.uid }))
        );
      });

      test('should open custom select dropdown when search field is focused and enter is pressed', () => {
        useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturnLoaded);
        component.setProps();
        let customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(false);
        const searchField = component.find('.searchField');
        searchField.simulate('focus');
        searchField.simulate('keyDown', { key: 'Enter' });
        component.update();
        component.update();
        customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(true);
      });
      test('should set search field to input value', () => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} selectionOverride={demoResultData[0]} />
        );
        const searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual(demoResultData[0].label);
      });
    });
    describe('Allow empty search', () => {
      beforeEach(() => {
        component = mount(
          <SearchAndSelectDropdown {...defaultProps} searchValue="" allowEmptySearch />
        );
      });

      test('should call async search fn when we modify the search input with empty value', () => {
        setTimeout.mockClear();
        expect(asyncSearchCall).toHaveBeenCalledWith([]);
        asyncSearchCall.mockClear();
        const searchVal = '';
        modifySearchInput(component, searchVal);
        expect(setTimeout).toHaveBeenCalledTimes(1);
        jest.runOnlyPendingTimers();
        expect(asyncSearchCall).toHaveBeenCalledWith([[]]);
      });
    });
    describe('Selection', () => {
      const selectedItem = demoResultData[0];
      beforeEach(() => {
        useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturnLoaded);
        component.setProps();
        const searchField = component.find('.searchField');
        searchField.simulate('keyDown', { key: 'Enter' });
        component.update();
      });
      test('should call handleItemSelect when an item is selected from the customSelectDropdown', () => {
        const customSelectDropdown = component.find(CustomSelectDropdown);
        customSelectDropdown.props().handleSelect(selectedItem.uid);
        expect(handleItemSelect).toHaveBeenCalledWith(selectedItem.uid);
      });
      test('should pass item uid and data to handle select from selection manager', () => {
        expect(useSelectionManager.mock.calls[0]).toEqual([
          {
            results: null,
            returnFieldOnSelect: defaultProps.returnFieldOnSelect,
            allowMultiple: defaultProps.allowMultiple,
            selectionOverride: defaultProps.selectionOverride,
            handleSelect,
            liveUpdate: true,
          },
        ]);
      });

      test('should hide results dropdown after item selected', () => {
        let customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(true);
        customSelectDropdown.props().handleSelect(selectedItem.uid);
        component.update();
        customSelectDropdown = component.find(CustomSelectDropdown);
        expect(customSelectDropdown.props().isOpen).toEqual(false);
      });
      test('should set the search value to match the selected items label field', () => {
        let searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual('');
        const customSelectDropdown = component.find(CustomSelectDropdown);
        customSelectDropdown.props().handleSelect(selectedItem.uid);
        component.update();
        searchField = component.find('.searchField');
        expect(searchField.props().value).toEqual(selectedItem.label);
      });
    });
    describe('Multi select', () => {
      const selectedItem = demoResultData[0];
      beforeEach(() => {
        useSelectionManager.mockClear().mockReturnValue({
          ...defaultSelectionManagerReturn,
          currentSelection: [demoResultData[0].uid, demoResultData[1].uid],
          currentSelectionLabels: [demoResultData[0].label, demoResultData[1].label],
        });
        component = mount(
          <SearchAndSelectDropdown {...{ ...defaultProps, allowMultiple: true }} />
        );
        useAsyncRequest.mockClear().mockReturnValue(defaultAsyncHookReturnLoaded);
        component.setProps();
        const searchField = component.find('.searchField');
        searchField.simulate('keyDown', { key: 'Enter' });
        component.update();
      });
      test('should call handleItemSelect with list when an item is selected from the customSelectDropdown', () => {
        const customSelectDropdown = component.find(CustomSelectDropdown);
        customSelectDropdown.props().handleSelect(selectedItem.uid);
        expect(handleItemSelect).toHaveBeenCalledWith(selectedItem.uid);
      });
      test('should show selected items buttons next to search bar', () => {
        const selectedItemsWrap = component.find('.selectedItemsWrap');
        const selectedItemsButtons = selectedItemsWrap.find('.searchSelectedItem');
        expect(selectedItemsButtons.length).toEqual(2);
      });
      test('should use item label not id', () => {
        const selectedItemsWrap = component.find('.selectedItemsWrap');
        const firstSelectedItemsButtons = selectedItemsWrap.find('.searchSelectedItem').first();
        expect(firstSelectedItemsButtons.text()).toEqual(demoResultData[0].label);
      });
      test('should call handle item select with uid when selected button pressed', () => {
        const selectedItemsWrap = component.find('.selectedItemsWrap');
        const firstSelectedItemsButtons = selectedItemsWrap.find('.searchSelectedItem').first();
        firstSelectedItemsButtons.simulate('click');
        component.update();
        expect(handleItemSelect).toHaveBeenCalledWith(demoResultData[0].uid);
      });
    });
  });
});
