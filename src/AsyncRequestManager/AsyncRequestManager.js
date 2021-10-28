/* eslint-disable import/prefer-default-export */
/* A react hook async request */

import { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';

const ENV = process.env.NODE_ENV;

const demoCallFn = async () => 'DEMO RESPONSE';

/**
 * Async React request hook
 *
 * @param {Object} {
 *   - args {Array} - the arguments to be passed to the callFn,
 *   - callFn {function} - the async function to call
 *   - cleanupFunc {function} - function to clean up the async call
 *   - callOnInit {bool}(true) - if true then will call the function on component mount
 *   - callback {function} - function to call when async call returns
 * }
 * @return {Object} {
 *   - response {any} - the response from the async call
 *   - reload {function} - function to recall the call function
 *   - call {function} - same as reload
 *   - loading {bool} - true when callfn has been called but not yet returned
 *   - hasLoaded {bool} - true after the callFn has been ran at least once
 *   - error {string} - error returned by callfn
 * }
 */
export const useAsyncRequest = ({
  id,
  args: argsInitial = [], // TODO: Rename to defaultArgs
  callFn = demoCallFn,
  cleanupFunc = () => {},
  callOnInit = true,
  debug = false,
  // eslint-disable-next-line no-unused-vars
  callback: callbackIn = (response, args) => {},
  errorCallback: errorCallbackIn = () => {},
}) => {
  // const [latestCallId, setLatestCallId] = useState(0);
  const [resultState, setResultState] = useState({
    isLoading: false,
    latestLoadingId: 0,
    resultsData: null,
    hasLoaded: false,
    error: null,
    callCount: 0,
  });
  const [args, setArgs] = useState(() => ({
    args: argsInitial,
    callback: callbackIn,
  }));
  const [allowLoad, setAllowLoad] = useState(callOnInit);
  const [forceLoad, setForceLoad] = useState(true);

  const reload = useCallback((argsUpdated, callbackOverride) => {
    if (argsUpdated && !Array.isArray(argsUpdated)) throw Error('Arguments must be array');
    setArgs((prev) => ({
      args: argsUpdated || prev.args,
      callback: callbackOverride || prev.callback,
    }));
    setAllowLoad(true);
    setForceLoad(true);
  }, []);

  // Call callback in use effect
  useEffect(() => {
    if (forceLoad && allowLoad) {
      setForceLoad(false);
      setResultState((prev) => ({
        ...prev,
        isLoading: true,
        latestLoadingId: prev.latestLoadingId + 1,
        resultsData: null,
        error: null,
      }));
      const newCallId = resultState.latestLoadingId + 1;
      if (!callFn) throw Error('Missing call fn');
      try {
        callFn(...args.args)
          .then((responseData) => {
            setResultState((prev) => {
              // check we are only returning the data from the most recent call
              if (prev.latestLoadingId === newCallId) {
                return {
                  ...prev,
                  isLoading: false,
                  // TODO: reseting latest loading id could result in the first call being accepted
                  latestLoadingId: 0, // reset latest loading id
                  resultsData: responseData,
                  hasLoaded: true,
                  callCount: prev.callCount + 1,
                };
              }
              return prev;
            });
            if (args.callback) args.callback(responseData, args.args);
            setArgs(() => ({
              args: argsInitial,
              callback: callbackIn,
            }));
          })
          .catch((e) => {
            if (ENV === 'development' || debug) {
              console.warn(`Async with ID: ${id} failed to run`);
              console.warn(e);
            }
            setResultState((prev) => {
              if (prev.latestLoadingId === newCallId) {
                return {
                  ...prev,
                  isLoading: false,
                  // TODO: reseting latest loading id could result in the first call being accepted
                  latestLoadingId: 0,
                  resultsData: null,
                  hasLoaded: true,
                  error: 'Failed to load',
                };
              }
              return prev;
            });
            const errorMessage = e.name === 'ApiError' ? e.message : 'Unknown Error';
            errorCallbackIn(e, errorMessage);
          });
      } catch (error) {
        console.error('Async Call function failed');
        throw error;
      }
    }
    return cleanupFunc;
  }, [
    forceLoad,
    allowLoad,
    args,
    resultState,
    callFn,
    cleanupFunc,
    debug,
    argsInitial,
    callbackIn,
    errorCallbackIn,
    id,
  ]);

  return {
    resultState,
    response: resultState.resultsData,
    reload,
    call: reload,
    loading: resultState.isLoading,
    hasLoaded: resultState.hasLoaded,
    error: resultState.error,
    callCount: resultState.callCount,
  };
};

useAsyncRequest.propTypes = {
  id: PropTypes.string.isRequired,
  args: PropTypes.arrayOf(PropTypes.any),
  callFn: PropTypes.func.isRequired, // async
  cleanupFunc: PropTypes.func,
  callOnInit: PropTypes.bool,
  debug: PropTypes.bool,
  callback: PropTypes.func,
};

useAsyncRequest.defaultProps = {
  callback: () => {},
};
