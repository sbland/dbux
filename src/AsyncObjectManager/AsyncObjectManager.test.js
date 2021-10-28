/* eslint-disable camelcase */
import { act, renderHook } from '@testing-library/react-hooks';
import useAsycObjectManager from '.';
import AsyncRequestManager from '../AsyncRequestManager';
// import { apiDeleteDocument, apiGetDocument, apiPostDocument, apiPutDocument } from '../../Api/Api';

Date.now = jest.fn().mockImplementation(() => 0);

jest.mock('../AsyncRequestManager', () => ({
  __esModule: true, // this property makes it work
  default: jest.fn(),
}));

const loadData = jest.fn();
// The default return values of the async hook
const loadedData = { loaded: 'data' };
const asyncHookReturnLoad_default = {
  call: loadData,
  loading: false,
  response: null,
};

const asyncHookReturnSave_default = {
  call: jest.fn().mockImplementation(() => {}),
  loading: false,
  response: null,
};
const asyncHookReturnSave_saved = {
  call: jest.fn().mockImplementation(() => {}),
  loading: false,
  response: { ok: true },
};

const asyncHookReturnDelete_default = {
  call: jest.fn().mockImplementation(() => {}),
  loading: false,
  response: null,
};

// async hook return values when state has changed
const asyncHookReturnLoad_loaded = {
  call: loadData,
  loading: false,
  response: loadedData,
};

const asyncGetDocument = jest.fn().mockImplementation(async () => {});
const asyncPutDocument = jest.fn().mockImplementation(async () => {});
const asyncPostDocument = jest.fn().mockImplementation(async () => {});
const asyncDeleteDocument = jest.fn().mockImplementation(async () => {});
const onSavedCallback = jest.fn();

const defaultArgs = {
  activeUid: 'demouid',
  collection: 'democollection',
  isNew: false,
  inputAdditionalData: {},
  schema: 'all',
  populate: 'all',
  loadOnInit: true,
  onSavedCallback,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
};

const defaultArgsNewObject = {
  activeUid: null,
  collection: 'democollection',
  isNew: true,
  inputAdditionalData: {},
  schema: 'all',
  loadOnInit: true,
  onSavedCallback,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
};

const setupAsyncRequestMock = ({ loadReturn, loadReturnLoaded, saveReturn, deleteReturn }) => ({
  callFn,
  callOnInit,
}) => {
  switch (callFn) {
    case asyncGetDocument:
      return callOnInit ? loadReturnLoaded : loadReturn;
    case asyncPostDocument:
      return saveReturn;
    case asyncPutDocument:
      return saveReturn;
    case asyncDeleteDocument:
      return deleteReturn;
    default:
      return null;
  }
};

const defaultAsyncHookReturns = {
  loadReturn: asyncHookReturnLoad_default,
  loadReturnLoaded: asyncHookReturnLoad_loaded,
  saveReturn: asyncHookReturnSave_default,
  deleteReturn: asyncHookReturnDelete_default,
};

const loadDataAction = async (rerender, args, demo_data) => {
  rerender(args);
  const loadHookCall = AsyncRequestManager.mock.calls[0].find((call) => call.id === 'loadAsync');
  await act(() => {
    loadHookCall.callback(demo_data);
  });
};

describe('useAsycObjectManager', () => {
  beforeEach(() => {
    loadData.mockClear();
    AsyncRequestManager.mockClear();
    AsyncRequestManager.mockImplementation(setupAsyncRequestMock(defaultAsyncHookReturns));
    onSavedCallback.mockClear();
    asyncHookReturnLoad_default.call.mockClear();
    asyncHookReturnLoad_loaded.call.mockClear();
    asyncHookReturnSave_default.call.mockClear();
    asyncHookReturnDelete_default.call.mockClear();
  });

  test('should initialize correct async request hooks', async () => {
    renderHook(() => useAsycObjectManager(defaultArgs));
    expect(AsyncRequestManager).toHaveBeenCalledTimes(3);
    expect(AsyncRequestManager.mock.calls).toEqual([
      // 1st call for load
      [
        {
          id: 'loadAsync',
          args: [
            defaultArgs.collection,
            defaultArgs.activeUid,
            defaultArgs.schema,
            defaultArgs.populate,
          ],
          callback: expect.any(Function),
          callFn: asyncGetDocument,
          callOnInit: true,
        },
      ],
      // second call for save
      [
        {
          id: 'saveAsync',
          callFn: asyncPutDocument,
          callOnInit: false,
          callback: expect.any(Function),
          errorCallback: expect.any(Function),
        },
      ],
      // third call for delete
      [
        {
          id: 'deleteAsync',
          args: [defaultArgs.collection, defaultArgs.activeUid],
          callFn: asyncDeleteDocument,
          callOnInit: false,
        },
      ],
    ]);
  });

  test('should pass load on init false to async request manager', async () => {
    renderHook(() => useAsycObjectManager({ ...defaultArgs, loadOnInit: false }));
    expect(AsyncRequestManager).toHaveBeenCalledTimes(3);
    expect(AsyncRequestManager.mock.calls[0]).toEqual([
      // 1st call for load
      {
        id: 'loadAsync',
        args: [
          defaultArgs.collection,
          defaultArgs.activeUid,
          defaultArgs.schema,
          defaultArgs.populate,
        ],
        callback: expect.any(Function),
        callFn: asyncGetDocument,
        callOnInit: false,
      },
    ]);
  });

  describe('loading data', () => {
    test('should pass empty data before loaded by async hook', () => {
      const args = { ...defaultArgs, loadOnInit: false };
      const { result } = renderHook((props) => useAsycObjectManager(props), {
        initialProps: args,
      });
      expect(result.current.data).toEqual({
        uid: defaultArgs.activeUid,
      });
    });
    test('should call load data when we call the returned reload function', () => {
      const { result } = renderHook(() => useAsycObjectManager(defaultArgs));
      expect(asyncHookReturnLoad_loaded.call).not.toHaveBeenCalled();
      act(() => {
        result.current.reload();
      });
      expect(asyncHookReturnLoad_loaded.call).toHaveBeenCalled();
    });

    test('should pass loaded data from async hook to data returned value', async () => {
      const { result, rerender } = renderHook((props) => useAsycObjectManager(props), {
        initialProps: defaultArgs,
      });
      await loadDataAction(rerender, defaultArgs, loadedData);
      expect(result.current.data).toEqual({
        uid: defaultArgs.activeUid,
        ...loadedData,
      });
    });

    test('should return combined data', async () => {
      const inputAdditionalData = { hello: 'world' };
      const args = {
        ...defaultArgs,
        inputAdditionalData,
      };
      const { result, rerender } = renderHook((props) => useAsycObjectManager(props), {
        initialProps: args,
      });
      await loadDataAction(rerender, args, loadedData);
      expect(result.current.data).toEqual({
        uid: defaultArgs.activeUid,
        ...inputAdditionalData,
        ...loadedData,
      });
    });
  });
  describe('Loaded', () => {
    let result;
    let rerender;
    beforeEach(async () => {
      ({ result, rerender } = renderHook((props) => useAsycObjectManager(props), {
        initialProps: defaultArgs,
      }));
      await loadDataAction(rerender, defaultArgs, loadedData);
    });

    describe('Updating data', () => {
      const updateData = { hello: 'world' };
      test('should update returned data after update data', async () => {
        await loadDataAction(rerender, defaultArgs, loadedData);
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
        });
        act(() => {
          result.current.updateData(updateData);
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...updateData,
        });
      });
      test('should update returned data after update form data', async () => {
        const newData = { hello: 'new world' };
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
        });
        act(() => {
          result.current.updateFormData('hello', 'new world');
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...newData,
        });
        expect(asyncHookReturnSave_default.call).not.toHaveBeenCalled();
      });
      test('should call async save after update form data if save is true', async () => {
        const newData = { hello: 'new world' };
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
        });
        act(() => {
          result.current.updateFormData('hello', 'new world', true);
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...newData,
        });
        expect(asyncHookReturnSave_default.call).toHaveBeenCalledWith([
          defaultArgs.collection,
          defaultArgs.activeUid,
          { ...loadedData, uid: defaultArgs.activeUid, ...newData },
        ]);
      });
    });
    describe('reloading', () => {
      beforeEach(() => {
        AsyncRequestManager.mockReturnValue(asyncHookReturnLoad_default);
      });
      test('should call async reload when reload called', async () => {
        const { result } = renderHook(() => useAsycObjectManager(defaultArgs));
        expect(asyncHookReturnLoad_default.call).toHaveBeenCalledTimes(0);
        result.current.reload();
        expect(asyncHookReturnLoad_default.call).toHaveBeenCalledTimes(1);
      });
    });
    describe('Deleting', () => {
      test('should call delete hook when delete func called', async () => {
        act(() => {
          result.current.deleteObject();
        });
        expect(asyncHookReturnDelete_default.call).toHaveBeenCalledTimes(1);
      });
    });
    describe('ResettingData', () => {
      const updateData = { hello: 'world' };
      // const resetAsync = () => {
      //   let i = 0;
      //   AsyncRequestManager
      //     .mockImplementation(() => {
      //       // console.log(i)
      //       if (i % 3 === 0) return asyncHookReturnLoad_default;
      //       if (i % 3 === 1) return asyncHookReturnSave_default;
      //       if (i % 3 === 2) return asyncHookReturnDelete_default;
      //       i += 1;
      //       return null;
      //     });
      // };
      test('should reset returned data to loaded data', async () => {
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
        });

        act(() => {
          result.current.updateData(updateData);
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...updateData,
        });
        act(() => {
          result.current.resetData(updateData);
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
        });
      });
      test('should reset back to last save point', () => {
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
        });
        act(() => {
          result.current.updateData(updateData);
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...updateData,
        });
        AsyncRequestManager.mockReturnValueOnce({
          ...asyncHookReturnLoad_default,
          response: loadedData,
        })
          .mockReturnValueOnce({ ...asyncHookReturnSave_default, response: { ok: true } })
          .mockReturnValueOnce(asyncHookReturnDelete_default);
        const saveAsync = AsyncRequestManager.mock.calls
          .filter((c) => c[0].id === 'saveAsync')
          .reverse()[0][0];
        saveAsync.callback('RESPONSE');
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...updateData,
        });
        act(() => {
          result.current.resetData();
        });
        expect(result.current.data).toEqual({
          uid: defaultArgs.activeUid,
          ...loadedData,
          ...updateData,
        });
      });
    });
    describe('Saving Data', () => {
      test('should call async save data on save data fn call', async () => {
        result.current.saveData();
        expect(asyncHookReturnSave_default.call).toHaveBeenCalledWith([
          defaultArgs.collection,
          defaultArgs.activeUid,
          { ...loadedData, uid: defaultArgs.activeUid },
        ]);
      });
      test('should call onsavedcallback after save', async () => {
        result.current.saveData();
        expect(loadData).not.toHaveBeenCalled();
        AsyncRequestManager.mockImplementation(
          setupAsyncRequestMock({
            ...defaultAsyncHookReturns,
            saveReturn: asyncHookReturnSave_saved,
          })
        );
        const saveAsync = AsyncRequestManager.mock.calls
          .filter((c) => c[0].id === 'saveAsync')
          .reverse()[0][0];

        saveAsync.callback({ ok: true });
        expect(loadData).not.toHaveBeenCalled();

        expect(onSavedCallback).toHaveBeenCalledTimes(1);
        expect(onSavedCallback).toHaveBeenCalledWith(
          defaultArgs.activeUid,
          { ok: true },
          { ...loadedData, uid: defaultArgs.activeUid }
        );
      });
      // TODO: Fix below test
      // test('should not call onsavedcallback unless has saved', () => {
      //   const { result, rerender } = renderHook(() => useAsycObjectManager(defaultArgs));
      //   result.current.saveData();
      //   AsyncRequestManager.mockImplementation(
      //     setupAsyncRequestMock({ ...defaultAsyncHookReturns, saveReturn: asyncHookReturnSave_saved })
      //   );
      //   rerender();

      //   expect(onSavedCallback).not.toHaveBeenCalled();
      // });
    });
  });

  describe('async state', () => {
    beforeEach(() => {
      AsyncRequestManager.mockReturnValueOnce({ ...asyncHookReturnLoad_default, loading: true })
        .mockReturnValueOnce({ ...asyncHookReturnSave_default, loading: true })
        .mockReturnValueOnce({ ...asyncHookReturnDelete_default, loading: true })
        .mockReturnValue({ ...asyncHookReturnLoad_default, loading: true });
    });
    test('should pass loading state to hook out', () => {
      const { result } = renderHook(() => useAsycObjectManager(defaultArgs));
      expect(result.current.loadingData).toEqual(true);
      expect(result.current.savingData).toEqual(true);
      expect(result.current.deletingData).toEqual(true);
    });
  });
  describe('New Objects', () => {
    beforeEach(() => {
      AsyncRequestManager.mockReturnValue({ ...asyncHookReturnLoad_default, loading: true });
    });
    test('should assign a new uid to new objects', () => {
      const { result } = renderHook(() => useAsycObjectManager(defaultArgsNewObject));
      expect(result.current.data).toEqual({
        uid: '0_democollection',
      });
    });
  });
});
