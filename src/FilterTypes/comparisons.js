export const stringComparisons = {
    equals: '=',
    contains: 'contains',
    regex: 'regex',
    empty: 'empty',
  };

  export const numberComparisons = {
    greaterThan: '>',
    lesserThan: '<',
  };

  export const dateComparisons = {
    after: 'after',
    before: 'before',
  };

  export default {
    equals: '=',
    ...stringComparisons,
    ...numberComparisons,
    ...dateComparisons,
  };
