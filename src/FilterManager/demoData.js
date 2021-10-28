import filterTypes from '../../GenericConstants/filterTypes';
import FilterObjectClass from './FilterObjectClass';
import comparisons from '../../GenericConstants/comparisons';

export const demoFilterString = new FilterObjectClass({
  uid: 'demoFilterString',
  field: 'name',
  value: 'Foo',
  operator: comparisons.contains,
  type: filterTypes.text,
});
export const demoFilterNumber = new FilterObjectClass({
  uid: 'demoFilterNumber',
  field: 'count',
  value: 0,
  operator: comparisons.greaterThan,
  type: filterTypes.number,
});
// export const demoFilterExpression = new FilterObjectClass({
//   uid: 'demoFilterExpression',
//   field: 'expression',
//   value: 0,
//   operator: '>',
// });

export const demoFilterSelect = new FilterObjectClass({
  uid: 'demoFilterExpression',
  field: 'select',
  value: 'a',
  operator: comparisons.contains,
  type: filterTypes.select,
});

export const demoFieldsData = {
  name: {
    uid: 'name',
    label: 'Name',
    type: filterTypes.text,
  },
  count: {
    uid: 'count',
    label: 'Count',
    type: filterTypes.number,
  },
  filterA: {
    uid: 'filterA',
    label: 'filter A',
    type: filterTypes.text,
  },
  filterB: {
    uid: 'filterB',
    label: 'filter B',
    type: filterTypes.text,
  },
  select: {
    uid: 'select',
    label: 'Select',
    type: filterTypes.select,
    options: [
      { uid: 'a', label: 'A' },
      { uid: 'b', label: 'B' },
    ],
  },
  filterEmbedded: {
    uid: 'filterEmbedded',
    label: 'Embedded Filter',
    type: filterTypes.embedded,
    filters: {
      filterC: {
        uid: 'filterC',
        label: 'filter C',
        type: filterTypes.text,
      },
      filterD: {
        uid: 'filterD',
        label: 'filter D',
        type: filterTypes.text,
      },
    },
  },
};

export const demoFiltersData = [
  demoFilterString,
  demoFilterNumber,
  // demoFilterExpression,
  demoFilterSelect,
];
