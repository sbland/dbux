import React from 'react';
import { shallow, mount } from 'enzyme';
import SearchAndSelect from './SearchAndSelect';
import { demoFiltersData, demoFieldsData } from '../FilterManager/demoData';
import { demoResultData, demoHeadingsData } from './inputDataShapes';
import StyledSelectList from '../StyledSelectList/StyledSelectList';
import FilterObjectClass from '../FilterManager/FilterObjectClass';
import filterTypes from '../../GenericConstants/filterTypes';
import comparisons from '../../GenericConstants/comparisons';
import AsyncRequestManager from '../AsyncRequestManager';
import { useSelectionManager } from './logic';

const DEFAULT_SORT_BY = 'uid';
// TODO: Mock styled select list

jest.mock('../AsyncRequestManager', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(),
}));

jest.mock('./logic', () => ({
  __esModule: true, // this property makes it work
  useSelectionManager: jest.fn(),
}));

const searchFunction = jest.fn().mockName('searchFunc');
const handleSelect = jest
  .fn()
  .mockName('handleSelect')
  .mockImplementation(() => {});
const mockLoadFn = jest.fn();

const reload = jest.fn().mockName('reload');

const defaultSasProps = {
  searchFunction,
  initialFilters: demoFiltersData,
  availableFilters: demoFieldsData,
  handleSelect,
  headings: demoHeadingsData,
};

const defaultAsyncHookReturn = {
  reload,
  loading: false,
  response: null,
};

const defaultUseSelectionManagerState = {
  currentSelection: [],
  currentSelectionUid: [],
  handleItemSelect: jest.fn().mockName('handleItemSelect'),
  selectAll: jest.fn().mockName('selectAll'),
  clearSelection: jest.fn().mockName('clearSelection'),
  acceptSelection: jest.fn().mockName('acceptSelection'),
};

describe('Search and Select', () => {
  describe('Snapshots', () => {
    beforeEach(() => {
      AsyncRequestManager.mockClear();
      useSelectionManager.mockClear();
      AsyncRequestManager.mockImplementation(() => defaultAsyncHookReturn);
      useSelectionManager.mockImplementation(() => defaultUseSelectionManagerState);
    });

    test('Default', () => {
      const component = shallow(<SearchAndSelect {...defaultSasProps} />);
      expect(component.debug()).toMatchSnapshot();
    });

    test('Default - with results', () => {
      AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, response: demoResultData });
      const component = shallow(<SearchAndSelect {...defaultSasProps} />);
      expect(component.debug()).toMatchSnapshot();
    });

    test('Default - loading', () => {
      AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const component = shallow(<SearchAndSelect {...defaultSasProps} />);
      expect(component.debug()).toMatchSnapshot();
    });
    test('Default - with search field', () => {
      AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const props = { ...defaultSasProps, showSearchField: true, searchFieldTargetField: 'name' };
      const component = shallow(<SearchAndSelect {...props} />);
      expect(component.debug()).toMatchSnapshot();
    });
    test('Default - with refresh btn', () => {
      AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const props = { ...defaultSasProps, showRefreshBtn: true };
      const component = shallow(<SearchAndSelect {...props} />);
      expect(component.debug()).toMatchSnapshot();
    });
    test('Multiple - with live update', () => {
      AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
      const props = { ...defaultSasProps, allowMultiple: true, liveUpdate: true };
      const component = shallow(<SearchAndSelect {...props} />);
      expect(component.debug()).toMatchSnapshot();
    });
  });

  describe('Unit Testing', () => {
    // Note we need to remount the SAS component for each test to ensure the hook mocks are updated

    beforeEach(() => {
      searchFunction.mockClear();
      handleSelect.mockClear();
      defaultAsyncHookReturn.reload.mockClear();
      defaultUseSelectionManagerState.handleItemSelect.mockClear();
      defaultUseSelectionManagerState.selectAll.mockClear();
      defaultUseSelectionManagerState.clearSelection.mockClear();
      AsyncRequestManager.mockClear();
      useSelectionManager.mockClear();
      AsyncRequestManager.mockImplementation(() => defaultAsyncHookReturn);
      useSelectionManager.mockImplementation(() => defaultUseSelectionManagerState);
    });

    describe('Performing Search', () => {
      test('should pass correct values to async hook', () => {
        mount(<SearchAndSelect {...defaultSasProps} />);
        expect(AsyncRequestManager).toHaveBeenCalledWith({
          args: [],
          callFn: searchFunction,
          callOnInit: false,
        });
      });

      test('If autoupdate is off does not load anything', () => {
        const props = { ...defaultSasProps, autoUpdate: false };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
      });

      test('should not load on init when loadOnInit is false', () => {
        const props = { ...defaultSasProps, autoUpdate: true, loadOnInit: false };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
      });

      test('should not perform search if filters empty and noEmptySearch is true', () => {
        const props = {
          ...defaultSasProps,
          autoUpdate: true,
          noEmptySearch: true,
          initialFilters: [],
        };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
      });

      test('Triggers search when we turn on autoupdate and loadOnInit is true', () => {
        const props = { ...defaultSasProps, autoUpdate: true };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          demoFiltersData,
          DEFAULT_SORT_BY,
          '',
          false,
        ]);
      });

      test('should show loading icon when loading results', () => {
        AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, loading: true });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        expect(component.exists('.sas_loadingWrap')).toBeTruthy();
      });

      test('should not show loading icon when not loading results', () => {
        AsyncRequestManager.mockReturnValue({ ...defaultAsyncHookReturn, loading: false });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        expect(component.exists('.sas_loadingWrap')).not.toBeTruthy();
      });

      test('Displays a list of results when search returns', () => {
        AsyncRequestManager.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        const props = { ...defaultSasProps, autoUpdate: true };
        const component = mount(<SearchAndSelect {...props} />);
        expect(component.find(StyledSelectList).props().listInput).toEqual(demoResultData);
      });
      test('should send search sort order to async request', () => {
        const sortBy = 'uid';
        const props = { ...defaultSasProps, autoUpdate: true, sortBy };
        mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          demoFiltersData,
          sortBy,
          '',
          false,
        ]);
      });
    });
    describe('Selecting Single', () => {
      test('should call handleSelect when a list item is selected and we hit accept selection', () => {
        AsyncRequestManager.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
        styledSelectList.props().handleSelect(demoResultData[0].uid);
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalledWith(
          demoResultData[0].uid
        );
      });

      test('should show results but unclickable when loading', () => {
        AsyncRequestManager.mockReturnValue({
          ...defaultAsyncHookReturn,
          loading: true,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        expect(component.exists('.sas_loadingWrap')).toBeTruthy();
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
        styledSelectList.props().handleSelect('demoid');
        expect(defaultUseSelectionManagerState.handleItemSelect).not.toHaveBeenCalled();
      });

      test('should show results as clickable when not loading', () => {
        AsyncRequestManager.mockReturnValue({
          ...defaultAsyncHookReturn,
          loading: false,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...defaultSasProps} />);
        const styledSelectList = component.find(StyledSelectList);
        expect(styledSelectList.props().listInput).toEqual(demoResultData);
        styledSelectList.props().handleSelect('demoid');
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalled();
      });
    });
    describe('Multiple Select', () => {
      const defaultSasPropsMultiSel = { ...defaultSasProps, allowMultiple: true };
      const demoCurrentSelection = [demoResultData[0]];
      const setupMultiComponent = () => {
        AsyncRequestManager.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        useSelectionManager.mockReturnValue({
          ...defaultUseSelectionManagerState,
          currentSelection: demoCurrentSelection,
          currentSelectionUid: demoCurrentSelection.map((d) => d.uid),
        });

        const component = mount(<SearchAndSelect {...defaultSasPropsMultiSel} />);
        return component;
      };

      // Helper func for selecting an item action
      const selectItem = (component, i) => {
        const resultsList = component.find('.sas_resultsList').children();
        const firstItemBtn = resultsList.find('.styledList_itemBtn').at(i);
        expect(firstItemBtn).toBeTruthy();
        firstItemBtn.simulate('click');
      };

      test('Calls handleItemSelect when a result item is clicked', () => {
        const component = setupMultiComponent();
        selectItem(component, 0);
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalledWith(
          demoResultData[0].uid
        );
        selectItem(component, 1);
        expect(defaultUseSelectionManagerState.handleItemSelect).toHaveBeenCalledWith(
          demoResultData[1].uid
        );
      });

      test('should show selected items as selected in list', () => {
        const component = setupMultiComponent();
        const selectAllBtn = component.find('.selectAllBtn');
        selectAllBtn.simulate('click');
        component.update();
        component.update();
        const selectList = component.find(StyledSelectList);
        const expectedLength = demoCurrentSelection.length;
        expect(selectList.props().currentSelection.length).toEqual(expectedLength);
        expect(component.find('.styledList_itemBtn').filter('.selected').length).toEqual(
          demoCurrentSelection.length
        );
      });

      test('Calls selection manager accept selection when clicking accept selection button', () => {
        const component = setupMultiComponent();
        const acceptSelectionBtn = component.find('.acceptSelectionBtn');
        acceptSelectionBtn.simulate('click');
        expect(defaultUseSelectionManagerState.acceptSelection).toHaveBeenCalled();
      });

      test('Call select all when clicking select all button', () => {
        const component = setupMultiComponent();
        const selectAllBtn = component.find('.selectAllBtn');
        expect(selectAllBtn).toBeTruthy();
        selectAllBtn.simulate('click');
        expect(defaultUseSelectionManagerState.selectAll).toHaveBeenCalled();
      });
    });
    describe('Search Field', () => {
      const defaultSasPropsSearchField = {
        ...defaultSasProps,
        autoUpdate: true,
        initialFilters: [],
        showSearchField: true,
        searchFieldTargetField: 'name',
      };
      const setupSearchComponent = (props) => {
        AsyncRequestManager.mockReturnValue({
          ...defaultAsyncHookReturn,
          response: demoResultData,
        });
        const component = mount(<SearchAndSelect {...props} />);
        return component;
      };

      test('should initiate search on search field input', () => {
        const component = setupSearchComponent(defaultSasPropsSearchField);
        const searchField = component.find('.searchField');

        let filters = [];
        let searchValue = '';

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          filters,
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
        mockLoadFn.mockClear();
        defaultAsyncHookReturn.reload.mockClear();

        searchValue = 'New Search';
        searchField.simulate('change', { target: { value: searchValue } });
        filters = [
          new FilterObjectClass({
            uid: 'search',
            field: defaultSasPropsSearchField.searchFieldTargetField,
            value: searchValue,
            operator: comparisons.contains,
            type: filterTypes.text,
          }),
        ];
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          filters,
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
      });
      test('should rerun search without search field if set to empty string', () => {
        const component = setupSearchComponent(defaultSasPropsSearchField);
        const searchValue = 'abc';
        const searchField = component.find('.searchField');

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
        mockLoadFn.mockClear();

        expect(searchField).toBeTruthy();
        searchField.simulate('change', { target: { value: searchValue } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [
            new FilterObjectClass({
              uid: 'search',
              field: defaultSasPropsSearchField.searchFieldTargetField,
              value: searchValue,
              operator: comparisons.contains,
              type: filterTypes.text,
            }),
          ],
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
        mockLoadFn.mockClear();

        searchField.simulate('change', { target: { value: '' } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          null,
          false,
        ]);
      });
      test('should run search with text search field if target search field prop is null', () => {
        const component = setupSearchComponent({
          ...defaultSasPropsSearchField,
          searchFieldTargetField: null,
        });
        let searchValue = '';
        const searchField = component.find('.searchField');

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          searchValue,
          false,
        ]);
        defaultAsyncHookReturn.reload.mockClear();
        searchValue = 'abc';

        expect(searchField).toBeTruthy();
        searchField.simulate('change', { target: { value: searchValue } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          searchValue,
          false,
        ]);
        defaultAsyncHookReturn.reload.mockClear();
        searchValue = '';

        searchField.simulate('change', { target: { value: '' } });

        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledWith([
          [],
          DEFAULT_SORT_BY,
          searchValue,
          false,
        ]);
      });
    });
    describe('Refresh button', () => {
      test('should run search when refresh button is pressed', () => {
        const props = { ...defaultSasProps, autoUpdate: false, showRefreshBtn: true };
        const component = mount(<SearchAndSelect {...props} />);
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(0);
        const refreshBtn = component.find('.refreshBtn');
        refreshBtn.simulate('click');
        expect(defaultAsyncHookReturn.reload).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe('Error Handling', () => {
    test('should throw error if initial filters is not an array', () => {
      expect(() =>
        mount(
          <SearchAndSelect
            searchFunction={async () => {}}
            initialFilters={{}}
            availableFilters={demoFieldsData}
            handleSelect={() => {}}
            headings={demoHeadingsData}
          />
        )
      ).toThrow('Initial Filters should be an array');
    });
  });
});
