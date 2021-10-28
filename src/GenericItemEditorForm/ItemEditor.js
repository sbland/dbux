import React, { useCallback, useState } from 'react';
import PropTypes from 'prop-types';
import useAsycObjectManager from '../AsyncObjectManager';
import { mapFields } from './FieldMapper';

const ItemEditor = ({
  // REACT
  inputUid,
  isNew,
  onSubmitCallback,
  additionalData,
  params,
  collection,
  asyncGetDocument,
  asyncPutDocument,
  asyncPostDocument,
  asyncDeleteDocument,
  customFieldComponents,
  saveErrorCallback,
  FormComponent,
}) => {
  const [overridenFields, setOverridenFields] = useState([]);

  const { saveData, updateFormData: updateField, data, uid, initialData } = useAsycObjectManager({
    activeUid: inputUid,
    collection,
    isNew: !inputUid || isNew,
    inputAdditionalData: additionalData,
    onSavedCallback: onSubmitCallback,
    loadOnInit: true,
    asyncGetDocument,
    asyncPutDocument,
    asyncPostDocument,
    asyncDeleteDocument,
    saveErrorCallback,
  });

  const mappedFields = mapFields(params, overridenFields, uid, collection);

  const handleUpdate = useCallback(
    (field, value) => {
      setOverridenFields((prev) => {
        const hasChanged =
          (value && !initialData) ||
          (value && !initialData[field]) ||
          (value && initialData && value !== initialData[field]) ||
          (!value && initialData[field]);
        const newSet = new Set([...prev, field]);
        if (!hasChanged) newSet.delete(field);
        return Array.from(newSet);
      });
      updateField(field, value);
    },
    [initialData, updateField]
  );

  const handleOnChange = useCallback(
    (field, value) => {
      handleUpdate(field, value);
    },
    [handleUpdate]
  );

  return (
    <div className="sectionWrapper">
      <FormComponent
        formDataInitial={data}
        headings={mappedFields}
        onSubmit={() => saveData()}
        onChange={handleOnChange}
        showEndBtns
        submitBtnText="Save Item"
        customFieldComponents={customFieldComponents}
      />
    </div>
  );
};

ItemEditor.propTypes = {
  inputUid: PropTypes.string,
  onSubmitCallback: PropTypes.func.isRequired,
  isNew: PropTypes.bool,
  additionalData: PropTypes.shape({}),
  collection: PropTypes.string.isRequired,
  params: PropTypes.arrayOf(
    PropTypes.shape({
      uid: PropTypes.string.isRequired,
      label: PropTypes.string.isRequired,
      type: PropTypes.string.isRequired,
      // type: PropTypes.oneOf(Object.keys(filterTypes)),
      required: PropTypes.bool,
      options: PropTypes.arrayOf(
        PropTypes.shape({
          uid: PropTypes.string.isRequired,
          label: PropTypes.string.isRequired,
        })
      ),
    })
  ).isRequired,
  asyncGetDocument: PropTypes.func, // Async func
  asyncPutDocument: PropTypes.func, // Async func
  asyncPostDocument: PropTypes.func, // Async func
  asyncDeleteDocument: PropTypes.func, // Async func
  customFieldComponents: PropTypes.objectOf(PropTypes.elementType),
  saveErrorCallback: PropTypes.func,
  FormComponent: PropTypes.elementType.isRequired,
};

ItemEditor.defaultProps = {
  inputUid: null,
  additionalData: {},
  isNew: false,
  asyncGetDocument: async() => { throw Error("Missing asyncGetDocument"); },
  asyncPutDocument: async() => { throw Error("Missing asyncPutDocument"); },
  asyncPostDocument: async() => { throw Error("Missing asyncPostDocument"); },
  asyncDeleteDocument: async() => { throw Error("Missing asyncDeleteDocument"); },
  customFieldComponents: {},
  saveErrorCallback: () => {},
};

export default ItemEditor;
