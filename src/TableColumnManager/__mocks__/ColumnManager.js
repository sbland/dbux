/* eslint-disable arrow-body-style */
/* eslint-disable no-unused-vars */

const useColumnManager = (
  headingsDataList,
  defaultColumnWidth = 200,
  unit = 10,
  extraWidth = 20,
  minWidth = 50,
  maxWidth = 2000,
) => {
  return {
    columnWidths: [],
    setColumnWidths: () => {},
    tableWidth: maxWidth,
    handleHideColumn: () => {},
    visableColumns: [],
    hiddenColumnIds: [],
    error: null,
  };
};

export default useColumnManager;
