/* eslint-disable import/prefer-default-export */
import { useCallback, useEffect, useState } from 'react';

export const useSelectionManager = ({
  results,
  returnFieldOnSelect = 'uid',
  allowMultiple,
  selectionOverride,
  handleSelect,
  liveUpdate,
  labelField = 'label',
}) => {
  const [currentSelection, setCurrentSelection] = useState(selectionOverride || []);
  const [selectionChanged, setSelectionChanged] = useState(false);

  const acceptSelection = useCallback(() => {
    setSelectionChanged(false);
    handleSelect(
      currentSelection.map((item) => item[returnFieldOnSelect]),
      currentSelection
    );
  }, [currentSelection, returnFieldOnSelect, handleSelect]);

  useEffect(() => {
    // TODO: This is a hack to make sure current selection is set to data loaded from api
    // TODO: An alternate approach would be to load additional data from api each time selection changes
    if (
      allowMultiple &&
      selectionOverride &&
      currentSelection !== selectionOverride &&
      typeof selectionOverride[0] === 'object'
    ) {
      if (Array.isArray(selectionOverride) || !allowMultiple) {
        setCurrentSelection(selectionOverride);
      } else {
        setCurrentSelection([selectionOverride]);
      }
    }
  }, [currentSelection, selectionOverride, allowMultiple]);

  // if live update is true and we change the selection we need to call the handle select function
  useEffect(() => {
    if (allowMultiple && liveUpdate && results && selectionChanged) {
      acceptSelection();
    }
  }, [
    acceptSelection,
    allowMultiple,
    liveUpdate,
    results,
    handleSelect,
    returnFieldOnSelect,
    selectionChanged,
  ]);

  const handleItemSelect = (uid) => {
    const selectedItemData =
      (results && results.find((r) => r.uid === uid)) ||
      currentSelection.find((item) => item.uid === uid);
    if (!selectedItemData) {
      console.log(currentSelection);
      throw Error(`Invalid Selection ${uid}`);
    }

    if (allowMultiple) {
      if (!Array.isArray(currentSelection)) {
        setCurrentSelection([selectedItemData]);
        return;
      }

      // TODO: Use find index here if we are storing all item data
      const indexInSelection = currentSelection.findIndex((item) => item.uid === uid);
      if (indexInSelection >= 0) {
        //  remove from selection
        setCurrentSelection((prev) => {
          const currentSelectionNew = prev.filter((i) => i.uid !== uid);
          setCurrentSelection(currentSelectionNew);
        });
      } else {
        // add to collection
        setCurrentSelection((prev) => {
          const currentSelectionNew = [...prev, selectedItemData];
          setCurrentSelection(currentSelectionNew);
        });
      }
    } else {
      // When selecting single selection return the requested field
      const fieldValue = selectedItemData[returnFieldOnSelect];
      setCurrentSelection([selectedItemData]);
      handleSelect(fieldValue, selectedItemData);
    }
    setSelectionChanged(true);
  };

  const selectAll = () => {
    setCurrentSelection(results);
  };

  const clearSelection = () => {
    setCurrentSelection([]);
    setSelectionChanged(true);
    if (liveUpdate) handleSelect([], []);
  };

  return {
    handleItemSelect,
    currentSelection,
    currentSelectionUid: currentSelection && currentSelection.map((item) => item.uid),
    currentSelectionLabels: currentSelection && currentSelection.map((item) => item[labelField]),
    selectAll,
    clearSelection,
    acceptSelection,
  };
};
