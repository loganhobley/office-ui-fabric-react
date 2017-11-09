import * as React from 'react';
import {
  BaseComponent,
  getNativeProps
} from '../../Utilities';
import { ButtonBase } from './_Base/Button.Base';
import { IButtonBaseProps } from './_Base/Button.Base.Props';
import { MenuButtonBase } from './_Base/MenuButton.Base';
import { IMenuButtonProps } from './_Base/MenuButton.Base.Props';
import { SplitButtonBase } from './_Base/SplitButton.Base';
import { ISplitButtonProps } from './_Base/SplitButton.Base.Props';

export class BaseButton extends BaseComponent<ISplitButtonProps, {}> {

  private get _isSplitButton(): boolean {
    return (!!this.props.menuProps && !!this.props.onClick) && this.props.split === true;
  }

  public render(): JSX.Element {

    if (this._isSplitButton) {
      return (
        <SplitButtonBase {...this.props } />
      );
    } else if (this.props.menuProps) {
      return (
        <MenuButtonBase {...this.props as IMenuButtonProps} />
      );
    } else {
      return (
        <ButtonBase {...this.props as IButtonBaseProps } />
      );
    }

  }

}