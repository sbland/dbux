/* eslint-disable indent */
/* eslint-disable react/jsx-indent */
/* eslint-disable react/jsx-one-expression-per-line */
/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import React from 'react';
import { storiesOf } from '@storybook/react';

import useAsyncObjectManager from './AsyncObjectManager';

function timeout(response, ms) {
  return new Promise((resolve) => setTimeout(() => resolve(response), ms));
}
const demoLoadedData = { goodbye: 'newworld' };
const asyncGetDocument = async () => timeout(demoLoadedData, 1000);
const asyncPutDocument = async () => timeout({ ok: true }, 1000);
const asyncPostDocument = async () => timeout({ ok: true }, 1000);
const asyncDeleteDocument = async () => timeout({ ok: true }, 1000);

const Viz = ({
  loadedData,
  saveData,
  updateData,
  updateFormData,
  resetData,
  reload,
  deleteObject,
  saveResponse,
  deleteResponse,
  loadingData,
  savingData,
  deletingData,
  data,
  uid,
  callCount,
}) => (
  <div>
    {uid}
    <button type="button" className="button-one" onClick={reload}>
      Reload data
    </button>
    <div>{loadingData ? 'loading data' : 'Loaded data'}</div>
    <div>
      Loaded data:
      {JSON.stringify(loadedData)}
    </div>
    <div>
      data:
      {JSON.stringify(data)}
    </div>
    <div>Callcount: {callCount}</div>
  </div>
);

const defaultArgs = {
  activeUid: 'demouid',
  collection: 'democollection',
  isNew: false,
  inputAdditionalData: {},
  schema: 'all',
  loadOnInit: false,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
};

storiesOf('Async Object Manager', module)
  .add('async test 1', () => {
    const {
      loadedData,
      saveData,
      updateData,
      updateFormData,
      resetData,
      reload,
      deleteObject,
      saveResponse,
      deleteResponse,
      loadingData,
      savingData,
      deletingData,
      data,
      uid,
      callCount,
    } = useAsyncObjectManager(defaultArgs);
    return (
      <Viz
        loadedData={loadedData}
        saveData={saveData}
        updateData={updateData}
        updateFormData={updateFormData}
        resetData={resetData}
        reload={reload}
        deleteObject={deleteObject}
        saveResponse={saveResponse}
        deleteResponse={deleteResponse}
        loadingData={loadingData}
        savingData={savingData}
        deletingData={deletingData}
        data={data}
        uid={uid}
        callCount={callCount}
      />
    );
  })
  .add('async test 2', () => {
    const {
      loadedData,
      saveData,
      updateData,
      updateFormData,
      resetData,
      reload,
      deleteObject,
      saveResponse,
      deleteResponse,
      loadingData,
      savingData,
      deletingData,
      data,
      uid,
      callCount,
    } = useAsyncObjectManager({
      ...defaultArgs,
      loadOnInit: true,
    });
    return (
      <Viz
        loadedData={loadedData}
        saveData={saveData}
        updateData={updateData}
        updateFormData={updateFormData}
        resetData={resetData}
        reload={reload}
        deleteObject={deleteObject}
        saveResponse={saveResponse}
        deleteResponse={deleteResponse}
        loadingData={loadingData}
        savingData={savingData}
        deletingData={deletingData}
        data={data}
        uid={uid}
        callCount={callCount}
      />
    );
  });
