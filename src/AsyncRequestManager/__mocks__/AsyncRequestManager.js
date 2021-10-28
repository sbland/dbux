const useAsyncRequest = ({
  args: argsInitial = [], // TODO: Rename to defaultArgs
  callFn,
  cleanupFunc = () => { },
  callOnInit = true,
  debug = false,
}) => {
  return {
    resultState: {},
    response: {},
    reload: () => { },
    call: () => { },
    loading: false,
    hasLoaded: (callOnInit),
    error: null,
    callCount: (callOnInit) ? 1 : 0,
  };
};
export default useAsyncRequest;
