import React from 'react';
import renderer from 'react-test-renderer';
import { demoListInputData, demoHeadingsData } from './inputDataShapes';
import StyledSelectList from './StyledSelectList';

test('Styled select list Snapshot', () => {
  const component = renderer.create(
    <StyledSelectList
      listInput={demoListInputData}
      headings={demoHeadingsData}
      handleSelect={() => {}}
    />
  );
  const tree = component.toJSON();
  expect(tree).toMatchSnapshot();
});
