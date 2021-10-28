import { renderHook, act } from '@testing-library/react-hooks';
import useAsyncRequest from '.';

describe('Data loader hook', () => {
  test('should delay data loading till reload is called', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );
    expect(result.current.response).toEqual(null);
    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(false);
    expect(result.current.error).toEqual(null);
    expect(mockLoadFn).toHaveBeenCalledTimes(0);

    act(() => {
      result.current.call();
    });
    expect(mockLoadFn).toHaveBeenCalledTimes(1);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    expect(result.current.loading).toEqual(true);
    expect(result.current.hasLoaded).toEqual(false);
    expect(result.current.response).toEqual(null);

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(null);
  });

  test('should load data immediately', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: true, callFn: mockLoadFn })
    );
    expect(result.current.loading).toEqual(true);
    expect(mockLoadFn).toHaveBeenCalledTimes(1);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(null);
  });

  test('should allow args override', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );
    expect(result.current.response).toEqual(null);
    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(false);
    expect(result.current.error).toEqual(null);

    result.current.reload(['hello']);
    expect(result.current.loading).toEqual(true);
    expect(result.current.hasLoaded).toEqual(false);

    expect(mockLoadFn).toHaveBeenCalledWith('hello');

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(null);
  });

  test('should handle multiple async calls', async () => {
    const args = ['products', 'filter'];
    const demoData = ['call 0 reponse', 'call 1 reponse', 'call 2 reponse'];
    // const r = [];

    const mockLoadFn = jest.fn().mockImplementation(async (i) => demoData[i]);

    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );
    result.current.reload([0]);
    result.current.reload([1]);
    result.current.reload([2]);

    expect(result.current.loading).toEqual(true);

    await waitForNextUpdate();
    expect(mockLoadFn).toHaveBeenCalledTimes(3);
    expect(mockLoadFn.mock.calls[0]).toEqual([0]);

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData[2]);
    expect(result.current.error).toEqual(null);
  });

  test('should handle multiple async calls and only return last called', async () => {
    // TODO: CHECK THIS!
    const args = ['products', 'filter'];
    const demoData = ['call 0 reponse', 'call 1 reponse', 'call 2 reponse'];
    const r = [];

    const delayedPromise = () =>
      new Promise((res) => {
        r.push(res);
      });

    const mockLoadFn = jest.fn().mockImplementation(async (i) => {
      await delayedPromise();
      return demoData[i];
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
    );

    result.current.reload([0]);
    result.current.reload([1]);
    result.current.reload([2]);

    expect(result.current.loading).toEqual(true);

    await waitForNextUpdate();
    expect(mockLoadFn).toHaveBeenCalledTimes(3);
    expect(mockLoadFn.mock.calls[0]).toEqual([0]);

    expect(result.current.loading).toEqual(true);
    /* Test that returning the first async call does not set loading to false
    as it is still waiting for the final call */
    r[0]();
    await waitForNextUpdate();
    expect(result.current.loading).toEqual(true);
    expect(result.current.response).toEqual(null);

    /* Test that returning the third async call sets loading to false and returns the results */
    r[2]();
    await waitForNextUpdate();
    expect(result.current.response).toEqual(demoData[2]);
    expect(result.current.loading).toEqual(false);

    /* Test that returning the second after the third does not change the state */
    r[1]();
    await waitForNextUpdate();
    expect(result.current.response).toEqual(demoData[2]);
    expect(result.current.loading).toEqual(false);

    /* Reloading the function clears everything back to the loading state */
    result.current.reload([0]);
    await waitForNextUpdate();
    expect(result.current.loading).toEqual(true);
    expect(result.current.response).toEqual(null);
  });

  test('should return error message if failed', async () => {
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => {
      throw Error();
    });
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: true, callFn: mockLoadFn })
    );
    expect(result.current.loading).toEqual(true);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    await waitForNextUpdate();

    expect(result.current.loading).toEqual(false);
    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(null);
    expect(result.current.error).toEqual('Failed to load');
  });
  test('should update call count', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const { result, waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({ args, callOnInit: true, callFn: mockLoadFn })
    );
    expect(result.current.callCount).toEqual(0);
    expect(result.current.loading).toEqual(true);
    expect(mockLoadFn).toHaveBeenCalledTimes(1);
    expect(mockLoadFn).toHaveBeenCalledWith('products', 'filter');

    await waitForNextUpdate();

    expect(result.current.hasLoaded).toEqual(true);
    expect(result.current.response).toEqual(demoData);
    expect(result.current.error).toEqual(null);
    expect(result.current.callCount).toEqual(1);
    result.current.reload([0]);
    await waitForNextUpdate();
    expect(result.current.callCount).toEqual(2);
  });
  test('should call callback on load complete', async () => {
    const demoData = 'hello';
    const args = ['products', 'filter'];
    const mockLoadFn = jest.fn().mockImplementation(async () => demoData);
    const callback = jest.fn();
    const { waitForNextUpdate } = renderHook(() =>
      useAsyncRequest({
        args,
        callOnInit: true,
        callFn: mockLoadFn,
        callback,
      })
    );
    expect(callback).not.toHaveBeenCalledWith(demoData);
    await waitForNextUpdate();
    expect(callback).toHaveBeenCalledWith(demoData, args);
  });
  describe('Reloading', () => {
    test('should call callfn on reqload request', async () => {
      const args = ['products', 'filter'];
      const demoData = ['call 0 reponse', 'call 1 reponse', 'call 2 reponse'];

      const mockLoadFn = jest.fn().mockImplementation(async (i) => demoData[i]);

      const { result, waitForNextUpdate } = renderHook(() =>
        useAsyncRequest({ args, callOnInit: false, callFn: mockLoadFn })
      );
      result.current.reload([0]);

      expect(result.current.loading).toEqual(true);

      await waitForNextUpdate();
      expect(mockLoadFn).toHaveBeenCalledTimes(1);
      expect(mockLoadFn.mock.calls[0]).toEqual([0]);

      expect(result.current.loading).toEqual(false);
      expect(result.current.hasLoaded).toEqual(true);
      expect(result.current.response).toEqual(demoData[0]);
      expect(result.current.error).toEqual(null);
    });
  });
});
