import comparisons from '../../GenericConstants/comparisons';
import filterTypes from '../../GenericConstants/filterTypes';
import { evaluateString, evaluateNumber, evaluateBool } from './FilterExpressions';

const getItemValue = (item, field) => {
  return field.split('.').reduce((acc, f) => {
    return acc && acc[f];
  }, item);
};

export default (customFilters = {}) => (filters, items) =>
  items.filter((item) =>
    filters
      .filter((f) => {
        // Filter out invalid filters
        const { field, type, operator, value: targetValue } = f;
        if (!field) return false;
        if (!type) return false;
        if (!operator) return false;
        // Ignore filters that have a null value

        if (
          operator !== comparisons.empty &&
          (targetValue == null || targetValue === undefined || targetValue === '')
        )
          return false;
        return true;
      })
      .every(
        // check item against every filter
        (filter) => {
          const { field, type, operator, value: targetValue } = filter;
          if (!item) return false;
          const itemFieldValue = getItemValue(item, field);

          switch (type) {
            case filterTypes.image:
            case filterTypes.file:
            case filterTypes.fileMultiple:
            case filterTypes.reference:
            case filterTypes.selectMulti:
            case filterTypes.select:
            case filterTypes.textLong:
            case filterTypes.text:
              return evaluateString(itemFieldValue, operator, targetValue);
            case filterTypes.number:
              return evaluateNumber(itemFieldValue, operator, targetValue);

            case filterTypes.bool:
            case filterTypes.toggle:
              return evaluateBool(itemFieldValue, operator, targetValue);
            // TODO: Set up below filters
            case filterTypes.embedded:
            case filterTypes.date:
            default: {
              const customFilter = customFilters[type];
              if (customFilter) {
                return customFilter(itemFieldValue, operator, targetValue, item);
              }
              throw Error(`Invalid Filter Type: ${filter.type}`);
            }
          }
        }
      )
  );
