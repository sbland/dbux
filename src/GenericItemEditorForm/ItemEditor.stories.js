import React from 'react';
import { storiesOf } from '@storybook/react';
import { DEMO_SETTINGS_DATA } from '../../PlatformConstants/demoData';
import ItemEditor from './ItemEditor';

const productParameters = DEMO_SETTINGS_DATA.productParams.options;

storiesOf('Item Editor', module).add('default', () => (
  <div className="productEditor_FormWrap sectionWrapper">
    <ItemEditor
      inputUid="abc"
      isNew={false}
      onSubmitCallback={() => {}}
      additionalData={{}}
      params={productParameters}
      collection="products"
      asyncGetDocument={async () => {}}
      asyncPutDocument={async () => {}}
      asyncPostDocument={async () => {}}
      asyncDeleteDocument={async () => {}}
    />
  </div>
));
