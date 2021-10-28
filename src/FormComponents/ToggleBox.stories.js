import React from 'react';

// eslint-disable-next-line import/no-extraneous-dependencies
import { storiesOf } from '@storybook/react';
import ToggleBox, { ToggleBoxRadioGroup } from './ToggleBox';

storiesOf('ToggleBox', module)
  .add('default', () => {
    return (
      <div className="sectionWrapper">
        <ToggleBox />
      </div>
    );
  })
  .add('radio group', () => {
    return (
      <ToggleBoxRadioGroup selected={0} onChange={(i, v) => console.log(i, v)} allowDeselect>
        <ToggleBox id={0} text="0" />
        <ToggleBox id={1} text="1" />
        <ToggleBox id={2} text="2" />
      </ToggleBoxRadioGroup>
    );
  })
  .add('radio group - no deselect', () => {
    return (
      <ToggleBoxRadioGroup selected={0} onChange={(i, v) => console.log(i, v)}>
        <ToggleBox id={0} text="0" />
        <ToggleBox id={1} text="1" />
        <ToggleBox id={2} text="2" />
      </ToggleBoxRadioGroup>
    );
  });
