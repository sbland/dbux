import filterTypes from '../FilterTypes';

export const injectFileFieldProps = (collection, id) => (param) => {
  let modifiedParam = { ...param };
  // If file type we need to add additional properties
  if ([filterTypes.file, filterTypes.fileMultiple, filterTypes.image].indexOf(param.type) !== -1) {
    // TODO: should throw error if we can't get the uid
    modifiedParam = { ...modifiedParam, collectionId: collection, documentId: id };
  }
  return modifiedParam;
};

export const injectHighlightOverriden = (overridenFields) => (param) => {
  let modifiedParam = { ...param };
  // if in overrides we need to highlight
  if (overridenFields && overridenFields.indexOf(param.uid) !== -1) {
    modifiedParam = { ...modifiedParam, hasChanged: true };
  }
  return modifiedParam;
};

export const reduceGroupFields = (acc, v) => {
  const currentSection = acc[acc.length - 1];
  const currentSectionChildCount = currentSection.children.length;
  const currentGroup =
    currentSectionChildCount > 0 ? currentSection.children[currentSectionChildCount - 1].group : 0;
  if (currentGroup !== v.group) {
    acc.push({
      uid: `group-${v.group}`,
      label: '',
      type: filterTypes.embedded,
      orientation: 'horiz',
      children: [],
    });
  }
  acc[acc.length - 1].children.push(v);
  return acc;
};

export const groupFields = (fields) => {
  return fields
    .reduce(reduceGroupFields, [
      {
        uid: 'group-0',
        label: '',
        type: filterTypes.embedded,
        orientation: 'horiz',
        children: [],
      },
    ])
    .filter((g) => g.children.length > 0);
};

/**
 * The map fields function injects additional data into each field
 * Including grouping, highlighting overriden fields, additional file properties
 *
 * @param {*} params
 * @param {*} standard
 * @param {*} overridenFields
 * @param {*} productId
 */
export const mapFields = (params, overridenFields, id, collection) =>
  Object.keys(params)
    // filter out standard specific fields
    // TODO: Do this in product editor
    // .filter((key) => !key.includes(standard === 'bsen' ? 'ansi' : 'bsen'))
    .map((key) => params[key])
    .map(injectFileFieldProps(collection, id))
    .map(injectHighlightOverriden(overridenFields))
    // group fields
    .reduce(reduceGroupFields, [
      {
        uid: 'group-0',
        label: '',
        type: filterTypes.embedded,
        orientation: 'horiz',
        children: [],
      },
    ])
    .filter((g) => g.children.length > 0);
