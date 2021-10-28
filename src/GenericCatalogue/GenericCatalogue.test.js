import React from 'react';
import { shallow } from 'enzyme';
import { MockReactC } from '../../Helpers/testing';
import GenericCatalogue from './GenericCatalogue';
import { demoHeadingsData, demoHeadingsDataSimple } from '../DataTable/demoData';

jest.mock('../../GenericComponents/PopupPanel/PopupPanel');
jest.mock('../../GenericComponents/SearchAndSelect/SearchAndSelect', () =>
  MockReactC('SearchAndSelect')
);
jest.mock('../../GenericComponents/NotificationBar/Provider');
jest.mock('../../GenericComponents/NotificationBar/actions');

describe('CertificateCatalogue', () => {
  it('Renders', () => {
    shallow(
      <GenericCatalogue
        itemName="Demo Item"
        collection="DEMO COLLECTION"
        additionalFilters={[]}
        resultsHeadings={demoHeadingsDataSimple}
        editorHeadings={demoHeadingsData}
        additionalSaveData={{}}
      />
    );
  });
  it('Matches Snapshot', () => {
    const component = shallow(
      <GenericCatalogue
        itemName="Demo Item"
        collection="DEMO COLLECTION"
        additionalFilters={[]}
        resultsHeadings={demoHeadingsDataSimple}
        editorHeadings={demoHeadingsData}
        additionalSaveData={{}}
      />
    );
    const tree = component.debug();
    expect(tree).toMatchSnapshot();
  });
});
