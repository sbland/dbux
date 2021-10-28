/* eslint-disable react/prop-types */
import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import SearchAndSelectDropdown from './SearchAndSelectDropdown';
import { demoResultData } from './inputDataShapes';

const LiveUpdateBtn = ({ liveUpdate, setLiveUpdate }) => (
  <button
    type="button"
    className={liveUpdate ? 'button-two' : 'button-one'}
    onClick={() => setLiveUpdate(!liveUpdate)}
  >
    Live Update
  </button>
);

const defaultProps = {
  searchFunction: async () =>
    new Promise((resolve) => setTimeout(() => resolve(demoResultData), 500)),
  handleSelect: (id) => alert(`Selected: ${id}`),
  labelField: 'label',
  debug: true,
  searchFieldTargetField: 'label',
};

storiesOf('Search and Select Dropdown', module)
  .add('Demo Data', () => {
    const props = { ...defaultProps };
    return (
      <div>
        <SearchAndSelectDropdown {...props} />
      </div>
    );
  })
  .add('Demo Data - multi', () => {
    const [liveUpdate, setLiveUpdate] = useState(false);
    const props = {
      ...defaultProps,
      autoUpdate: liveUpdate,
      allowMultiple: true,
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelectDropdown {...props} />
      </div>
    );
  })
  .add('Demo Data - allow empty', () => {
    const props = { ...defaultProps };
    return (
      <div>
        <SearchAndSelectDropdown {...props} allowEmptySearch />
      </div>
    );
  })
  .add('Demo Data - multiple labels', () => {
    const props = { ...defaultProps, labelField: ['label', 'uid'] };
    return (
      <div>
        <SearchAndSelectDropdown {...props} allowEmptySearch />
      </div>
    );
  })
  .add('Demo Data - allow empty instant', () => {
    const props = { ...defaultProps };
    return (
      <div>
        <SearchAndSelectDropdown
          {...props}
          allowEmptySearch
          searchFunction={async () => demoResultData}
          searchDelay={0}
        />
      </div>
    );
  });
