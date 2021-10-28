import React, { useMemo, useRef } from 'react';
import PropTypes from 'prop-types';
import styles from './StyledSelectList.module.scss';
import useColumnManager from '../TableColumnManager/ColumnManager';
import { stringifyData } from '../helpers/dataSanitizers';

export const ListItem = ({
  data,
  handleSelect,
  headings,
  columnWidths,
  customParsers,
  isSelected,
}) => {
  return (
    <button
      key={data.uid}
      className={`${styles.styledList_itemBtn} ${isSelected ? 'selected' : ''}`}
      type="button"
      onClick={() => handleSelect(data.uid)}
    >
      {headings.map((heading, i) => (
        <div
          key={heading.uid}
          style={{
            width: columnWidths[i],
          }}
          className={`${styles.styledList_itemCell} ${isSelected ? 'selected' : ''}`}
        >
          {stringifyData(data[heading.uid], heading, customParsers)}
        </div>
      ))}
    </button>
  );
};

ListItem.propTypes = {
  data: PropTypes.shape({
    uid: PropTypes.string.isRequired,
  }).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  handleSelect: PropTypes.func.isRequired,
  customParsers: PropTypes.objectOf(PropTypes.func).isRequired,
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  isSelected: PropTypes.bool.isRequired,
};

const StyledSelectList = ({
  listInput,
  headings,
  handleSelect,
  currentSelection,
  limitHeight,
  selectionField,
  autoWidth,
  customParsers,
}) => {
  const containerRef = useRef(null);
  const {
    columnWidths,
    // setColumnWidths,
    // tableWidth
  } = useColumnManager({
    headingsDataList: headings,
    minWidth: 100,
    maxWidth: 1000,
    autoWidth,
    containerRef,
  });

  const mapHeadings = headings.map((heading, i) => (
    <div
      key={heading.uid}
      className="styledList_heading"
      style={{
        width: columnWidths[i],
      }}
    >
      {heading.label}
    </div>
  ));
  const mapItems = useMemo(
    () =>
      listInput.map((item) => (
        <ListItem
          data={item}
          currentSelection={currentSelection}
          selectionField={selectionField}
          handleSelect={handleSelect}
          headings={headings}
          columnWidths={columnWidths}
          customParsers={customParsers}
          isSelected={currentSelection && currentSelection.indexOf(item[selectionField]) >= 0}
          key={item.uid}
        />
      )),
    [
      headings,
      columnWidths,
      currentSelection,
      selectionField,
      handleSelect,
      listInput,
      customParsers,
    ]
  );
  const itemListClassName = [
    'styledList_items',
    limitHeight ? 'styledList_items-limitHeight' : '',
  ].join(' ');

  return (
    <div
      className="styledList"
      style={{
        position: 'relative',
        ...(limitHeight ? { maxHeight: `${limitHeight}rem` } : {}),
      }}
      ref={containerRef}
    >
      {/* TODO: This is causing a memory leak! */}
      {/* <DataTableColumnWidthManager
        setColumnWidths={setColumnWidths}
        columnWidths={columnWidths}
        minWidth={100}
        maxWidth={1000}
      /> */}
      <div style={{ zIndex: 10 }} className="styledList_headings">
        {mapHeadings}
      </div>
      <div style={{ zIndex: 10 }} className={itemListClassName}>
        {mapItems}
      </div>
    </div>
  );
};

StyledSelectList.propTypes = {
  listInput: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
    })
  ).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
    })
  ).isRequired,
  handleSelect: PropTypes.func.isRequired,
  currentSelection: PropTypes.arrayOf(PropTypes.string),
  limitHeight: PropTypes.number,
  selectionField: PropTypes.string.isRequired,
  autoWidth: PropTypes.bool,
  customParsers: PropTypes.objectOf(PropTypes.func),
};

StyledSelectList.defaultProps = {
  currentSelection: null,
  limitHeight: 0,
  autoWidth: true,
  customParsers: {},
};

export default StyledSelectList;
