import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';

let lastMousePos = 0;
let columnWidthOverride = [];

const DataTableColumnWidthManager = ({
  // columnCount,
  columnWidths,
  setColumnWidths,
  minWidth,
  maxWidth,
}) => {
  const dataTableRef = useRef(null);

  const [showColumnResizeTool, setshowColumnResizeTool] = useState(-1); // True if not -1
  const [resizingColumn, setresizingColumn] = useState(false);

  // Use offset column positions to determine
  let widthSum = 0;

  const columnEdgePositions = columnWidths.map((cwidth) => {
    widthSum += cwidth;

    return widthSum;
  });

  // called on mouse move over resize overlay when dragging
  const resizeColumn = (e) => {
    const newWidths = [...columnWidthOverride];
    const newWidth = newWidths[showColumnResizeTool] + e.clientX - lastMousePos;
    // TODO: Limit by max width
    // if less than min width set as min width
    newWidths[showColumnResizeTool] = newWidth > minWidth ? newWidth : minWidth;
    setColumnWidths(newWidths);
    columnWidthOverride = [...newWidths];
    lastMousePos = e.clientX;
  };

  const endDragging = () => {
    setresizingColumn(false);
    setshowColumnResizeTool(-1);
    lastMousePos = 0;
  };

  return (
    <div
      ref={dataTableRef}
      className="DataTable_columnWidthManager"
      onMouseMove={(e) => {
        if (!resizingColumn) {
          // On mouse move check if we are hovering over the edge of a column
          const offsetPosData = dataTableRef.current.getBoundingClientRect();
          const mousePos = { x: e.clientX, y: e.clientY };
          const offsetColumnEdgePositions = columnEdgePositions.map(
            (cpos) => cpos + offsetPosData.x
          );
          const mouseDistanceToColumnEdge = offsetColumnEdgePositions.map(
            (cpos) => cpos - mousePos.x
          );
          const isMouseOverEdgeList = mouseDistanceToColumnEdge.map(
            (cdist) => Math.abs(cdist) < 10
          );
          const columnEdgeIndex = isMouseOverEdgeList.indexOf(true);
          setshowColumnResizeTool(columnEdgeIndex);
        }
      }}
      onMouseLeave={endDragging}
    >
      {resizingColumn && (
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
        <div
          className="dataTable_columnResizeCanvas"
          onMouseUp={() => {
            setresizingColumn(false);
            lastMousePos = 0;
          }}
          onMouseLeave={() => {
            setresizingColumn(false);
            lastMousePos = 0;
          }}
          onMouseMove={(e) => {
            if (resizingColumn) resizeColumn(e);
          }}
        />
      )}

      {showColumnResizeTool !== -1 && (
        // eslint-disable-next-line max-len
        // eslint-disable-next-line jsx-a11y/no-static-element-interactions, jsx-a11y/mouse-events-have-key-events
        <div
          className="dataTable_columnResizeHandle"
          style={{
            left: `${columnEdgePositions[showColumnResizeTool] - 5}px`,
            pointerEvents: `${resizingColumn ? 'none' : 'all'}`,
            // background: `${(resizingColumn) ? 'red' : 'blue'}`,
          }}
          onMouseDown={(e) => {
            setresizingColumn(true);
            lastMousePos = e.clientX;
            columnWidthOverride = [...columnWidths];
            window.addEventListener('mouseup', () => {
              window.removeEventListener('mouseup', this);
              setresizingColumn(false);
              setshowColumnResizeTool(-1);
              lastMousePos = 0;
            });
          }}
          onMouseUp={endDragging}
          // onMouseLeave={endDragging}
        />
      )}
    </div>
  );
};

DataTableColumnWidthManager.propTypes = {
  columnWidths: PropTypes.arrayOf(PropTypes.number).isRequired,
  setColumnWidths: PropTypes.func.isRequired,
  minWidth: PropTypes.number,
  maxWidth: PropTypes.number,
  // columnCount: PropTypes.number.isRequired,
};

DataTableColumnWidthManager.defaultProps = {
  minWidth: 50,
  maxWidth: 300,
};

export default DataTableColumnWidthManager;
