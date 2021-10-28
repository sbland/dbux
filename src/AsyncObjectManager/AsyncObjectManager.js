/* eslint-disable import/prefer-default-export */
/* A react hook async request */

import { useCallback, useEffect, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';

import useAsyncRequest from '../AsyncRequestManager';
// import {
//   // apiDeleteDocument,
//   // apiGetDocument,
//   // apiPostDocument,
//   // apiPutDocument,
// } from '../../Api/Api';
import generateUid from './helpers';


/**
 * Async React request hook
 *
 * @param {Object} {
 *   - `activeUid` {string} - the active object uid
 *   - `collection` {string} - the collection to load and save to
 *   - `isNew` {bool} - true if the object is new
 *   - `inputAdditionalData` {object} - additional data to be merged with the loaded data
 *   - `schema` {string|Array} - schema override for loading data
 *   - `loadOnInit` {bool} - true if we should load the object on component init
 * }
 * @return {Object} {
 *   - `saveData` {func} - save object function
 *   - `updateData` {func} - update edit data ()
 *   - `updateFormData` = (field, value, save = false) => {...}
 *   - `reload` {func} - reload and reset the object
 *   - `deleteObject` {func} - delete the object
 *   - `saveResponse` {string} - api response to saving the object
 *   - `deleteResponse` {func} - api response to deleting the object
 *   - `loadingData` {bool} - true when loading data
 *   - `savingData` {bool} - true when saving data
 *   - `deletingData` {bool} - true when deleting data
 *   - `data` {any} - the data returned from api and combined with additional data
 *   - `uid` {string} - the active uid
 *   - `callCount` {number} - number of times called
 *   - `hasLoaded` {bool} - true if we have loaded data
 * }
 */
export const useAsycObjectManager = ({
  activeUid,
  collection,
  isNew: isNewIn = false,
  // TODO: Setting below causes it to rerun on render
  inputAdditionalData = null,
  schema = 'all',
  populate = 'all',
  loadOnInit = true,
  reloadOnSave = false,
  onSavedCallback: onSavedCallbackIn = () => {},
  saveErrorCallback = () => {},
  onDeleteCallback = () => {},
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
}) => {
  const [isNew, setIsNew] = useState(!activeUid || isNewIn);
  const [uid] = useState(isNew || !activeUid ? generateUid(collection) : activeUid);
  const [editData, setEditData] = useState({});
  const [resetToData, setResetToData] = useState({});
  const loadArgs = useMemo(() => [collection, uid, schema, populate], [
    collection,
    uid,
    schema,
    populate,
  ]);

  const [loadedData, setLoadedData] = useState(null);

  const loadedDataCallback = (newLoadedData) => {
    setLoadedData(newLoadedData);
    setEditData({});
  };

  const { call: loadAsync, loading: loadingData, callCount, hasLoaded } = useAsyncRequest({
    id: 'loadAsync',
    // TODO: Add populate
    args: loadArgs,
    callFn: asyncGetDocument,
    callOnInit: loadOnInit && !isNew,
    callback: loadedDataCallback,
  });

  const combinedData = useMemo(() => {
    return {
      ...loadedData,
      ...inputAdditionalData,
      uid,
      ...editData,
    };
  }, [loadedData, inputAdditionalData, uid, editData]);

  const onSavedCallback = useCallback(
    (response) => {
      setIsNew(false);
      setResetToData({
        ...loadedData,
        ...inputAdditionalData,
        uid,
        ...editData,
      });
      if (reloadOnSave) {
        loadAsync(loadArgs, (loadedResponse) => {
          onSavedCallbackIn(uid, response, combinedData);
          loadedDataCallback(loadedResponse);
        });
      } else {
        onSavedCallbackIn(uid, response, combinedData);
      }
    },
    [
      uid,
      combinedData,
      onSavedCallbackIn,
      editData,
      inputAdditionalData,
      loadedData,
      reloadOnSave,
      loadAsync,
      loadArgs,
    ]
  );

  const { response: saveResponse, call: saveAsync, loading: savingData } = useAsyncRequest({
    id: 'saveAsync',
    callFn: isNew ? asyncPostDocument : asyncPutDocument,
    callOnInit: false,
    callback: onSavedCallback,
    errorCallback: saveErrorCallback,
  });

  const { response: deleteResponse, call: deleteAsync, loading: deletingData } = useAsyncRequest({
    id: 'deleteAsync',
    args: [collection, uid],
    callFn: isNew ? () => {} : asyncDeleteDocument,
    callOnInit: false,
  });

  // useEffect(() => {
  //   setResetToData({ ...loadedData, ...inputAdditionalData, uid });
  //   setEditData({ ...loadedData, ...inputAdditionalData, uid });
  //   // FIXME: Adding input additional data as as dependency causes a loop
  // }, [loadedData, inputAdditionalData, uid]);

  useEffect(() => {
    if (deleteResponse && deleteResponse.ok) {
      onDeleteCallback(uid, deleteResponse);
    }
  }, [deleteResponse, onDeleteCallback, uid]);

  const saveData = useCallback(() => {
    saveAsync([collection, uid, combinedData]);
  }, [collection, uid, combinedData, saveAsync]);

  const updateData = useCallback((newData) => {
    setEditData((prev) => ({ ...prev, ...newData }));
  }, []);

  const updateFormData = useCallback(
    (field, value, save = false) => {
      setEditData((prev) => {
        const dataCopy = cloneDeep(prev);
        dataCopy[field] = value;
        if (save) {
          const dataToSave = {
            ...loadedData,
            ...inputAdditionalData,
            uid,
            ...dataCopy,
          };
          saveAsync([collection, uid, dataToSave]);
        }
        return dataCopy;
      });
    },
    [collection, uid, inputAdditionalData, loadedData, saveAsync]
  );

  const reload = useCallback(() => loadAsync(), [loadAsync]);
  const deleteObject = useCallback(() => deleteAsync(), [deleteAsync]);
  const resetData = useCallback(() => {
    setEditData(resetToData);
  }, [resetToData]);

  return {
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
    data: combinedData,
    initialData: resetToData,
    uid,
    callCount,
    hasLoaded,
  };
};

useAsycObjectManager.propTypes = {
  activeUid: PropTypes.string.isRequired,
  collection: PropTypes.string.isRequired,
  isNew: PropTypes.bool.isRequired,
  inputAdditionalData: PropTypes.Object,
  schema: PropTypes.arrayOf(PropTypes.string).isRequired,
  loadOnInit: PropTypes.bool,
  reloadOnSave: PropTypes.bool,
  onSavedCallback: PropTypes.func,
  asyncGetDocument: PropTypes.func.isRequired,
  asyncPutDocument: PropTypes.func.isRequired,
  asyncPostDocument: PropTypes.func.isRequired,
  asyncDeleteDocument: PropTypes.func.isRequired,
};

// export default useAsycObjectManager;
