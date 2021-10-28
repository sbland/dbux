# Filter Manager

Creates a filter panel where filters can be added, updated and deleted
Note that the filter data uses the filter field property to find its type in the field list

# Example

## Component

```
const [filters, setFilters] = useState(demoFiltersData);

return (
  <FilterManager
    filterData={filters}
    setFilterData={setFilters}
    fieldsData={demoFieldsData}
    showPanelOverride
  />
);

```

# Filter Data

**demoFilterString**

```
{
  uid: 'demoFilterString',
  field: 'name',
  value: 'Foo',
  operator: 'contains',
};

```

Valid Operators:

- `contains`
- `is exactly`

**demoFilterNumber**

```
{
  uid: 'demoFilterNumber',
  field: 'count',
  value: 0,
  operator: '>',
};
```

Valid Expressions:

- `>`
- `<`
- `=`

# fieldsData

```
demoFieldsData = {
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
  filterEmbedded: {
    uid: 'filterEmbedded',
    label: 'Embedded Filter',
    type: 'embedded',
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
```
