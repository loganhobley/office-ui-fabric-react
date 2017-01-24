import * as React from 'react';
import {
  PrimaryButton,
  Label
} from '../../../../index';
import { IButtonProps } from './IButtonProps';

export class ButtonScreenReaderExample extends React.Component<IButtonProps, {}> {
  public constructor() {
    super();
  }

  public render() {
    let { disabled } = this.props;

    return (
      <div className='ms-BasicButtonsExample'>
        <Label>Button with aria description for screen reader</Label>
        <PrimaryButton
          data-automation-id='test'
          disabled={ disabled }
          ariaDescription='This is aria description used for screen reader.'>
          Aria Description
        </PrimaryButton>
      </div>
    );
  }
}