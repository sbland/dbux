const filterTypes = {
    text: 'text',
    textLong: 'textLong',
    select: 'select',
    selectMulti: 'selectMulti',
    selectSearch: 'selectSearch',
    bool: 'bool',
    toggle: 'toggle',
    date: 'date',
    number: 'number',
    uid: 'uid',
    reference: 'reference',
    file: 'file',
    fileMultiple: 'fileMultiple',
    image: 'image',
    embedded: 'embedded',
    // TODO: Below should not be filter types
    button: 'button',
    dict: 'dict',
  };

  export default filterTypes;

  export const filterTypesList = Object.keys(filterTypes);
