/* A react hook async request */

const useAsycObjectManager = ({
  activeUid,
  collection,
  isNew = false,
  inputAdditionalData = {},
  schema = 'all',
  loadOnInit = true,
  onSavedCallback = () => {},
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
}) => {
  return {
    loadedData: {},
    saveData: () => {},
    updateData: () => {},
    updateFormData: () => {},
    resetData: () => {},
    reload: () => {},
    deleteObject: () => {},
    saveResponse: {},
    deleteResponse: {},
    loadingData: false,
    savingData: false,
    deletingData: false,
    data: { uid: activeUid },
    uid: activeUid,
    callCount: loadOnInit && !isNew ? 1 : 0,
  };
};

export default useAsycObjectManager;
