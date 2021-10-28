import { renderHook } from '@testing-library/react-hooks';
import { useSelectionManager } from './logic';

const handleSelect = jest.fn();
describe('Search and Select - Logic', () => {
  const returnField = 'uid';
  const labelField = 'name';
  const defaultUseSelectionManagerInputs = {
    results: [],
    returnFieldOnSelect: returnField,
    allowMultiple: false,
    labelField,
    selectionOverride: null,
    handleSelect,
  };

  const demoResults = [
    { uid: 'demoid', name: 'demoname' },
    { uid: 'demoid_02', name: 'demoname_02' },
  ];

  describe('Selecting', () => {
    beforeEach(() => {
      handleSelect.mockClear();
    });

    test('should handle select single', () => {
      const { result } = renderHook(() =>
        useSelectionManager({ ...defaultUseSelectionManagerInputs, results: demoResults })
      );
      expect(result.current.currentSelection).toEqual([]);
      expect(typeof result.current.handleItemSelect).toEqual('function');
      expect(typeof result.current.selectAll).toEqual('function');
      expect(typeof result.current.clearSelection).toEqual('function');

      expect(handleSelect).not.toHaveBeenCalled();

      // First selection
      result.current.handleItemSelect(demoResults[0].uid);
      expect(handleSelect).toHaveBeenCalledWith(demoResults[0][returnField], demoResults[0]);
      expect(result.current.currentSelection).toEqual([demoResults[0]]);

      // Second selection
      result.current.handleItemSelect(demoResults[1].uid);
      expect(handleSelect).toHaveBeenCalledWith(demoResults[1][returnField], demoResults[1]);
      expect(result.current.currentSelection).toEqual([demoResults[1]]);
    });

    test('should select multiple', () => {
      const { result } = renderHook(() =>
        useSelectionManager({
          ...defaultUseSelectionManagerInputs,
          results: demoResults,
          allowMultiple: true,
        })
      );
      expect(result.current.currentSelection).toEqual([]);
      expect(typeof result.current.handleItemSelect).toEqual('function');
      expect(typeof result.current.selectAll).toEqual('function');
      expect(typeof result.current.clearSelection).toEqual('function');

      expect(handleSelect).not.toHaveBeenCalled();

      // First selection
      const item1ToSelect = demoResults[0];
      result.current.handleItemSelect(item1ToSelect.uid);
      expect(handleSelect).not.toHaveBeenCalled();
      expect(result.current.currentSelection).toEqual([item1ToSelect]);

      // Second selection
      const item2ToSelect = demoResults[1];
      result.current.handleItemSelect(item2ToSelect.uid);
      expect(result.current.currentSelection).toEqual([item1ToSelect, item2ToSelect]);
    });

    test('should remove from multiselect if already selected', () => {
      const { result } = renderHook(() =>
        useSelectionManager({
          ...defaultUseSelectionManagerInputs,
          results: demoResults,
          allowMultiple: true,
        })
      );
      expect(result.current.currentSelection).toEqual([]);
      expect(typeof result.current.handleItemSelect).toEqual('function');
      expect(typeof result.current.selectAll).toEqual('function');
      expect(typeof result.current.clearSelection).toEqual('function');

      expect(handleSelect).not.toHaveBeenCalled();

      // First selection
      const item1ToSelect = demoResults[0];
      result.current.handleItemSelect(item1ToSelect.uid);
      expect(handleSelect).not.toHaveBeenCalled();
      expect(result.current.currentSelection).toEqual([item1ToSelect]);

      // Second selection
      result.current.handleItemSelect(item1ToSelect.uid);
      expect(result.current.currentSelection).toEqual([]);
    });
    test('should select all items when selectAll is called', () => {
      const { result } = renderHook(() =>
        useSelectionManager({
          ...defaultUseSelectionManagerInputs,
          results: demoResults,
          allowMultiple: true,
        })
      );
      expect(result.current.currentSelection).toEqual([]);
      expect(typeof result.current.handleItemSelect).toEqual('function');
      expect(typeof result.current.selectAll).toEqual('function');
      expect(typeof result.current.clearSelection).toEqual('function');

      expect(handleSelect).not.toHaveBeenCalled();

      result.current.selectAll();
      expect(result.current.currentSelection).toEqual(demoResults);
    });
    test('should return current selection everytime it changes in liveUpdate mode', async () => {
      const { result, waitForNextUpdate } = renderHook(() =>
        useSelectionManager({
          ...defaultUseSelectionManagerInputs,
          results: demoResults,
          allowMultiple: true,
          liveUpdate: true,
        })
      );
      expect(handleSelect).not.toHaveBeenCalled();
      handleSelect.mockClear();
      const itemToSelect = demoResults[0];
      result.current.handleItemSelect(itemToSelect.uid);
      await waitForNextUpdate();

      expect(handleSelect).toHaveBeenCalledWith([itemToSelect[returnField]], [itemToSelect]);
      handleSelect.mockClear();
      const item2ToSelect = demoResults[1];
      result.current.handleItemSelect(item2ToSelect.uid);
      await waitForNextUpdate();

      expect(handleSelect).toHaveBeenCalledWith(
        [itemToSelect[returnField], item2ToSelect[returnField]],
        [itemToSelect, item2ToSelect]
      );
    });
    test('should return selection labels as well as ids', () => {
      const { result } = renderHook(() =>
        useSelectionManager({
          ...defaultUseSelectionManagerInputs,
          results: demoResults,
          allowMultiple: true,
        })
      );
      expect(result.current.currentSelection).toEqual([]);
      result.current.selectAll();
      expect(result.current.currentSelection).toEqual(demoResults);
      expect(result.current.currentSelectionLabels).toEqual(
        demoResults.map((item) => item[labelField])
      );
    });
  });
});
