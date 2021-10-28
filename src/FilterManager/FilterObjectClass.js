/* eslint-disable max-classes-per-file */
import filterTypes from '../FilterTypes';
import comparisons from '../FilterTypes/comparisons';

const getDefaultComparison = (fieldType) => {
  switch (fieldType) {
    case filterTypes.bool:
      return comparisons.equals;
    case filterTypes.text:
    case filterTypes.textLong:
      return comparisons.contains;
    default:
      return comparisons.equals;
  }
};

const getDefaultValue = (fieldType) => {
  switch (fieldType) {
    case filterTypes.bool:
    case filterTypes.toggle:
      return false;
    case filterTypes.number:
      return 0;
    case filterTypes.string:
    default:
      return '';
  }
};

export default class FilterObjectClass {
  constructor({
    uid = `filter_${Date.now()}`,
    field = null,
    label = null,
    value = null,
    operator = null,
    type = filterTypes.text,
    filterOptionId = null,
    isCustomType = false,
  } = {}) {
    /* validate input */
    if (!(type in filterTypes) && !isCustomType)
      console.warn(`Invalid Filter Type ${type} must set isCustomType`);
    if (!field && !uid) throw Error('Must have field or UID');
    // if (value == null) throw Error('Must have value');
    if (operator && Object.values(comparisons).indexOf(operator) === -1)
      throw Error(`Invalid operator ${operator}`);
    this.uid = uid;
    this.field = field;
    this.value = value != null && value !== undefined ? value : getDefaultValue(type);
    this.label = label || field;
    this.operator = operator || getDefaultComparison(type);
    this.type = type;
    this.filterOptionId = filterOptionId || field;
    Object.freeze(this);
  }
}

export class FilterObjectSimpleClass extends FilterObjectClass {
  constructor(field, value, uid = null) {
    if (!field) throw Error('Must have field');
    super({
      uid: uid || `filter_${Date.now()}`,
      field,
      value,
      operator: comparisons.equals,
      type: filterTypes.text,
    });
  }
}
