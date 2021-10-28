import React from 'react';
import PropTypes from 'prop-types';

import { stringifyData } from '../helpers/dataSanitizers';

import './_SelectionPreview.scss';

const SelectionPreview = ({
  headings,
  currentSelectionData,
  customParsers,
  listStyleOverride,
  maxHeight,
}) => {
  const cellData = currentSelectionData
    ? headings.map((heading) => {
        const cleanedValue = stringifyData(
          currentSelectionData[heading.uid],
          heading,
          customParsers
        );
        return [heading.uid, heading.label, cleanedValue];
      })
    : [];
  return (
    <div className="flexHoriz">
      <ul
        className="selectionPreview_listWrap flexGrow"
        style={{ ...listStyleOverride, maxHeight: `${maxHeight}rem` }}
      >
        {cellData.map(([uid, label, value]) => {
          return (
            <li className="selectionPreview_listItem" key={uid}>
              <div className="selectionPreview_labelWrap">
                <label className="selectionPreview_label">{label}: </label>
              </div>
              <div className="selectionPreview_valueWrap">{value}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

SelectionPreview.propTypes = {
  currentSelectionData: PropTypes.shape({
    uid: PropTypes.string,
    label: PropTypes.string,
  }).isRequired,
  headings: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
    })
  ).isRequired,
  customParsers: PropTypes.objectOf(PropTypes.func),
  listStyleOverride: PropTypes.shape({ maxHeight: PropTypes.number }),
  maxHeight: PropTypes.number.isRequired,
};

SelectionPreview.defaultProps = {
  customParsers: {},
  listStyleOverride: {},
};

export default SelectionPreview;
