import comparisons from '../../GenericConstants/comparisons';
import filterTypes from '../../GenericConstants/filterTypes';
import { demoFiltersData } from './demoData';
import filterDataFunc from './filterDataFunc';
import FilterObjectClass from './FilterObjectClass';

describe('Filter Data Func', () => {
  test('should filter data', () => {
    const itemToFind = { uid: 'foo', name: 'FooBar', count: 3, select: 'a' };
    const filters = demoFiltersData;
    const demoItems = [itemToFind, { uid: 'bar', name: 'bar', count: 0, select: 'a' }];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems).toEqual([itemToFind]);
  });
  test('should filter string with regex', () => {
    const itemToFind = { uid: 'foo', name: 'foo-bar', count: 3, select: 'a' };
    const filters = [
      new FilterObjectClass({
        uid: 'doorRefFilter',
        field: 'name',
        value: '^foo.*$',
        operator: comparisons.regex,
        type: filterTypes.text,
      }),
    ];
    const demoItems = [
      itemToFind,
      { uid: 'bar', name: 'bar', count: 0, select: 'a' },
      { uid: 'bar', name: 'bar', count: 0, select: 'a' },
    ];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems.map((f) => f.uid)).toEqual(['foo']);
  });
  test('should filter out rows with blank data for column of filter', () => {
    const itemToFind = { uid: 'foo', name: 'foo-bar', count: 3, select: 'a' };
    const filters = [
      new FilterObjectClass({
        uid: 'doorRefFilter',
        field: 'name',
        value: 'foo',
        operator: comparisons.contains,
        type: filterTypes.text,
      }),
    ];
    const demoItems = [
      itemToFind,
      { uid: 'bar', name: 'bar', count: 0, select: 'a' },
      { uid: 'bar', name: '', count: 0, select: 'a' },
    ];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems.map((f) => f.uid)).toEqual(['foo']);
  });
  test('should filter data with nested field', () => {
    const itemToFind = { uid: 'foo', name: 'FooBar', count: 3, select: 'a', data: { uid: 'a' } };
    const filters = [
      new FilterObjectClass({
        uid: 'demoNestedFilter',
        field: 'data.uid',
        value: 'a',
        operator: comparisons.contains,
        type: filterTypes.text,
      }),
    ];
    const demoItems = [
      itemToFind,
      { uid: 'bar', name: 'bar', count: 0, select: 'a', data: { uid: 'b' } },
    ];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems).toEqual([itemToFind]);
  });

  test('should filter data with bool field', () => {
    const itemToFind = { uid: 'foo', name: 'FooBar', toggle: true };
    const filters = [
      new FilterObjectClass({
        uid: 'demoBoolFilter',
        field: 'toggle',
        value: true,
        operator: comparisons.equals,
        type: filterTypes.bool,
      }),
    ];
    const demoItems = [itemToFind, { uid: 'bar', name: 'bar', toggle: false }];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems).toEqual([itemToFind]);
  });
  test('should filter data with false bool field', () => {
    const itemToFind = { uid: 'foo', name: 'FooBar', toggle: false };
    const filters = [
      new FilterObjectClass({
        uid: 'demoBoolFilter',
        field: 'toggle',
        value: false,
        operator: comparisons.equals,
        type: filterTypes.bool,
      }),
    ];
    const demoItems = [itemToFind, { uid: 'bar', name: 'bar', toggle: true }];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems).toEqual([itemToFind]);
  });
  test('should filter using custom filter', () => {
    const itemToFind = { uid: 'foo', name: 'FooBar', toggle: false };
    const filters = [
      new FilterObjectClass({
        uid: 'demoBoolFilter',
        field: 'toggle',
        value: false,
        operator: comparisons.equals,
        type: 'customFilter',
        isCustomType: true,
      }),
    ];
    const demoItems = [itemToFind, { uid: 'bar', name: 'bar', toggle: true }];

    const customFilter = jest.fn().mockReturnValue(true);
    const filteredItems = filterDataFunc({
      customFilter,
    })(filters, demoItems);
    expect(filteredItems).toEqual(demoItems);
    expect(customFilter).toHaveBeenCalledWith(
      filteredItems[0].toggle,
      filters[0].operator,
      filters[0].value,
      filteredItems[0]
    );
    expect(customFilter).toHaveBeenCalledWith(
      filteredItems[1].toggle,
      filters[0].operator,
      filters[0].value,
      filteredItems[1]
    );
  });
  test('should throw invalid filter error if no filter exists', () => {
    const itemToFind = { uid: 'foo', name: 'FooBar', toggle: false };
    const filters = [
      new FilterObjectClass({
        uid: 'demoBoolFilter',
        field: 'toggle',
        value: false,
        operator: comparisons.equals,
        type: 'missingfilter',
        isCustomType: true,
      }),
    ];
    const demoItems = [itemToFind, { uid: 'bar', name: 'bar', toggle: true }];

    const filteredItems = () => filterDataFunc()(filters, demoItems);
    expect(filteredItems).toThrow('Invalid Filter Type: missingfilter');
  });
  test('should allow filtering by empty string', () => {
    const itemToFind = { uid: 'foo', name: '', count: 3, select: 'a', data: { uid: 'a' } };
    const filters = [
      new FilterObjectClass({
        uid: 'demoNestedFilter',
        field: 'name',
        value: '',
        operator: comparisons.empty,
        type: filterTypes.text,
      }),
    ];
    const demoItems = [
      itemToFind,
      { uid: 'bar', name: 'bar', count: 0, select: 'a', data: { uid: 'b' } },
    ];

    const filteredItems = filterDataFunc()(filters, demoItems);
    expect(filteredItems).toEqual([itemToFind]);
  });
});
