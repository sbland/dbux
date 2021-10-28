import { mapFields } from './FieldMapper';

const productParameters = [
  {
    uid: 'product-code',
    label: 'Product Code',
    type: 'text',
    required: true,
    group: 0,
  },
  {
    uid: 'product-standard',
    label: 'Product Standard',
    type: 'select',
    options: [
      {
        uid: 'bsen',
        label: 'BSEN',
      },
      {
        uid: 'ansi',
        label: 'ANSI',
      },
    ],
    required: true,
    group: 0,
  },
  {
    uid: 'finish',
    label: 'Finish',
    type: 'reference',
    collection: 'productfinishes',
    group: 1,
    objectLink: true,
  },

  {
    uid: 'fire-rating',
    label: 'Fire Rating',
    type: 'select',
    influencer: true,
    group: 1,
    options: [
      {
        uid: 'FR30',
        label: 'FR30',
      },
      {
        uid: 'FR45',
        label: 'FR45',
      },
      {
        uid: 'FR60',
        label: 'FR60',
      },
    ],
  },
  {
    uid: 'cost',
    label: 'Cost',
    type: 'number',
    group: 2,
    required: true,
  },

  {
    uid: 'images',
    label: 'Images',
    multiple: true,
    fileType: 'image',
    type: 'image',
    group: 3,
  },
  {
    uid: 'quantity',
    label: 'Quantity',
    type: 'number',
    readOnly: true,
    group: 4,
  },
];
describe('Item Editor Field Mapper', () => {
  test('should map fields to headings', () => {
    // TODO: Finish implementing this test
    const params = productParameters;
    const overridenFields = [];
    const productId = 'prodId';
    const collection = 'products';
    const headings = mapFields(params, overridenFields, productId, collection);
    expect(headings).toMatchSnapshot();
  });
  test('should make quantity editable if is set to editable', () => {
    const quantityParam = {
      uid: 'quantity',
      label: 'Quantity',
      type: 'number',
      readOnly: true,
      group: 1,
    };
    const params = [quantityParam];
    const overridenFields = [];
    const productId = 'prodId';
    const headings = mapFields(params, overridenFields, productId, 'products');
    expect(headings[0].children).toEqual([{ ...quantityParam, readOnly: true }]);
  });
});
