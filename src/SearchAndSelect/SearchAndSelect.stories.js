/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React, { useState } from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import SearchAndSelect from './SearchAndSelect';
import {
  demoResultData,
  demoHeadingsData,
  demoPreviewHeadingsData,
  demoResultsDataMany,
} from './inputDataShapes';
import { demoFiltersData, demoFieldsData } from '../FilterManager/demoData';

const LiveUpdateBtn = ({ liveUpdate, setLiveUpdate }) => (
  <button
    type="button"
    className={liveUpdate ? 'button-two' : 'button-one'}
    onClick={() => setLiveUpdate(!liveUpdate)}
  >
    Live Update
  </button>
);

const defaultSearchFn = async () =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultData), 2000));

const searchFnManyResults = async () =>
  new Promise((resolve) => setTimeout(() => resolve(demoResultsDataMany), 2000));

const defaultProps = {
  searchFunction: defaultSearchFn,
  initialFilters: demoFiltersData,
  availableFilters: demoFieldsData,
  handleSelect: (id) => alert(`Selected: ${id}`),
  headings: demoHeadingsData,
  debug: true,
};

storiesOf('Search and Select', module)
  .add('Demo Data', () => {
    const [liveUpdate, setLiveUpdate] = useState(false);
    const props = { ...defaultProps, autoUpdate: liveUpdate };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect {...props} />
      </div>
    );
  })
  .add('Search field', () => {
    const [liveUpdate, setLiveUpdate] = useState(false);
    const props = {
      ...defaultProps,
      autoUpdate: liveUpdate,
      showSearchField: true,
      searchFieldTargetField: 'name',
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect {...props} />
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
        <SearchAndSelect {...props} />
      </div>
    );
  })
  .add('Demo Data - multi - autoupdate', () => {
    const [liveUpdate, setLiveUpdate] = useState(false);
    const [selection, setSelection] = useState(null);
    const props = {
      ...defaultProps,
      autoUpdate: liveUpdate,
      allowMultiple: true,
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect
          {...props}
          handleSelect={(uids, data) => setSelection(uids)}
          liveUpdate
          allowMultiple
        />
        <button type="button" className="button-one" onClick={() => alert(selection)}>
          Accept selection
        </button>
        {JSON.stringify(selection)}
      </div>
    );
  })
  .add('Demo Data - refresh btn', () => {
    const [liveUpdate, setLiveUpdate] = useState(false);
    const props = {
      ...defaultProps,
      autoUpdate: liveUpdate,
      showRefreshBtn: true,
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect {...props} />
      </div>
    );
  })
  .add('Demo Data - use name as selection field', () => {
    const [liveUpdate, setLiveUpdate] = useState(false);
    const props = {
      ...defaultProps,
      autoUpdate: liveUpdate,
      showRefreshBtn: true,
      allowMultiple: true,
      returnFieldOnSelect: 'name',
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect {...props} />
      </div>
    );
  })
  .add('Selection Preview', () => {
    const [liveUpdate, setLiveUpdate] = useState(true);
    const props = {
      ...defaultProps,
      handleSelect: () => {},
      autoUpdate: liveUpdate,
      showSearchField: true,
      searchFieldTargetField: 'name',
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect
          allowSelectionPreview
          previewHeadings={demoPreviewHeadingsData}
          {...props}
        />
      </div>
    );
  })
  .add('Selection Preview many results', () => {
    const [liveUpdate, setLiveUpdate] = useState(true);
    const props = {
      ...defaultProps,
      autoUpdate: liveUpdate,
      showSearchField: true,
      searchFieldTargetField: 'name',
      handleSelect: () => {},
      previewHeadings: demoPreviewHeadingsData,
      allowSelectionPreview: true,
      searchFunction: searchFnManyResults,
      limitResultHeight: 25,
      previewMaxHeight: 6,
    };
    return (
      <div>
        <LiveUpdateBtn {...{ liveUpdate, setLiveUpdate }} />
        <SearchAndSelect {...props} />
      </div>
    );
  });
