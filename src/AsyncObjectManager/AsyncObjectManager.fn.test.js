/* eslint-disable camelcase */
import { renderHook } from '@testing-library/react-hooks';
import useAsycObjectManager from '.';

Date.now = jest.fn().mockImplementation(() => 0);

const loadedData = { loaded: 'data' };

const asyncGetDocument = jest.fn().mockImplementation(async () => loadedData);
const asyncPutDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
const asyncPostDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
const asyncDeleteDocument = jest.fn().mockImplementation(async () => ({ ok: true }));
const onSavedCallback = jest.fn();

const defaultArgs = {
  activeUid: 'demouid',
  collection: 'democollection',
  isNew: false,
  inputAdditionalData: {},
  schema: 'all',
  populate: 'all',
  loadOnInit: true,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  onSavedCallback,
};

describe('useAsycObjectManager_functional', () => {
  beforeEach(() => {
    asyncGetDocument.mockClear();
    asyncPutDocument.mockClear();
    asyncPostDocument.mockClear();
    asyncDeleteDocument.mockClear();
    onSavedCallback.mockClear();
  });
  test('should call async get docs', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsycObjectManager(defaultArgs));
    expect(asyncGetDocument).toHaveBeenCalledWith(
      defaultArgs.collection,
      defaultArgs.activeUid,
      defaultArgs.schema,
      defaultArgs.populate
    );
    expect(result.current.loadedData).toEqual(null);
    expect(result.current.data).toEqual({
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });
    await waitForNextUpdate();
    expect(result.current.loadedData).toEqual(loadedData);
    expect(result.current.data).toEqual({
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });
  });
  test('should save data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsycObjectManager(defaultArgs));
    await waitForNextUpdate();
    result.current.saveData();
    expect(asyncPutDocument).toHaveBeenCalledWith(defaultArgs.collection, defaultArgs.activeUid, {
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });
  });
  test('should update form data', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsycObjectManager(defaultArgs));
    await waitForNextUpdate();
    expect(result.current.data).toEqual({
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });
    const editField = 'edit';
    const editValue = 'val';
    result.current.updateFormData(editField, editValue);
    expect(result.current.data).toEqual({
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
      [editField]: editValue,
    });
  });
  test('should update form data and save', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useAsycObjectManager(defaultArgs));
    await waitForNextUpdate();
    expect(onSavedCallback).not.toHaveBeenCalled();
    expect(result.current.data).toEqual({
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });

    asyncGetDocument.mockClear();

    /* Update field */
    const editField = 'edit';
    const editValue = 'val';
    result.current.updateFormData(editField, editValue, true);
    await waitForNextUpdate();

    /* put document is called */
    expect(asyncPutDocument).toHaveBeenCalledWith(defaultArgs.collection, defaultArgs.activeUid, {
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
      [editField]: editValue,
    });

    /* On save callback called */
    expect(onSavedCallback).toHaveBeenCalledWith(
      defaultArgs.activeUid,
      { ok: true },
      { uid: defaultArgs.activeUid }
    );
    expect(onSavedCallback).toHaveBeenCalledTimes(1);

    expect(asyncGetDocument).not.toHaveBeenCalled();
    /* Final data should be the reloaded data with all other changes claered */
    expect(result.current.data).toEqual({
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
      [editField]: editValue,
    });
  });
  test('should update form data and save then reload', async () => {
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsycObjectManager({ ...defaultArgs, reloadOnSave: true })
    );
    await waitForNextUpdate();
    expect(result.current.data).toEqual({
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });

    /* We provide alternate load data to show that data is reloaded */
    const altLoadedData = { ...loadedData, altdata: 'altdata' };
    asyncGetDocument.mockClear();
    asyncGetDocument.mockImplementation(async () => altLoadedData);

    /* Update field */
    const editField = 'edit';
    const editValue = 'val';
    result.current.updateFormData(editField, editValue, true);
    await waitForNextUpdate();

    /* put document is called */
    expect(asyncPutDocument).toHaveBeenCalledWith(defaultArgs.collection, defaultArgs.activeUid, {
      ...loadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
      [editField]: editValue,
    });
    await waitForNextUpdate();

    /* On save callback called */
    expect(onSavedCallback).toHaveBeenCalledWith(
      defaultArgs.activeUid,
      { ok: true },
      { uid: defaultArgs.activeUid }
    );
    expect(onSavedCallback).toHaveBeenCalledTimes(1);

    /* We now reload data */
    expect(asyncGetDocument).toHaveBeenCalledWith(
      defaultArgs.collection,
      defaultArgs.activeUid,
      'all',
      'all'
    );

    /* Final data should be the reloaded data with all other changes claered */
    expect(result.current.data).toEqual({
      ...altLoadedData,
      ...defaultArgs.inputAdditionalData,
      uid: defaultArgs.activeUid,
    });
  });
});
