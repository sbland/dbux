import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import StyledSelectList from './StyledSelectList';
import { demoListInputData, demoHeadingsData, demoListInputDataLong } from './inputDataShapes';

storiesOf('Styled Select List', module)
  .add('Demo Data', () => (
    <StyledSelectList
      listInput={demoListInputData}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
    />
  ))
  .add('Demo Data Long', () => (
    <StyledSelectList
      listInput={demoListInputDataLong}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
    />
  ))
  .add('Demo Data Long Scroll', () => (
    <StyledSelectList
      listInput={demoListInputDataLong}
      headings={demoHeadingsData}
      handleSelect={(id) => alert(`Selected: ${id}`)}
      limitHeight
    />
  ));
