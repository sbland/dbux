import comparisons from '../../GenericConstants/comparisons';

const stringContains = (val, searchTerm) => {
  return (val && val.search(new RegExp(searchTerm))) !== -1;
};

export const evaluateString = (value, operator, target) => {
  if (operator === comparisons.empty) {
    return value === '' || value === null || value === undefined;
  }
  if (typeof value === 'string') {
    switch (operator) {
      case comparisons.equals:
        return value === target;
      case comparisons.contains:
        if (value == null || value === undefined || value === '') return false;
        return stringContains(value, target);
      case comparisons.regex:
        if (value == null || value === undefined || value === '') return false;
        return new RegExp(target, 'g').test(value);
      default:
        return false;
    }
  }
  return false;
};

export const evaluateNumber = (value, operator, target) => {
  if (value == null || value === undefined || value === '') return false;
  if (target === null || target === undefined) return true;
  if (operator === null || operator === undefined) return true;
  if (typeof value === 'number') {
    // const operator = `${val} ${filter.operator} ${filterValue}`;
    switch (operator) {
      case comparisons.equals:
        return value === target;
      case comparisons.greaterThan:
        return value > target;
      case comparisons.lesserThan:
        return value < target;
      default:
        return false;
    }
    // return mathEvaluate(operator);
  }
  return false;
};

export const evaluateBool = (value, operator, target) => {
  if (target === null || target === undefined) return true;
  if (operator === null || operator === undefined) return true;
  // NOTE: we match false target to any none value
  switch (operator) {
    case comparisons.equals:
      return (!value && !target) || value === target;
    default:
      return false;
  }
};
