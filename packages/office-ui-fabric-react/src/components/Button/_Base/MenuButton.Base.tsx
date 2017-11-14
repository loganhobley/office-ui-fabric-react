import * as React from 'react';
import {
  BaseComponent,
  IRenderFunction,
  anchorProperties,
  assign,
  autobind,
  buttonProperties,
  getId,
  getNativeProps,
  KeyCodes,
  customizable
} from '../../../Utilities';
import { ButtonBase } from './Button.Base';
import { IButtonBaseProps } from './Button.Base.types';
import { Icon, IIconProps } from '../../../Icon';
import { DirectionalHint } from '../../../common/DirectionalHint';
import { ContextualMenu, IContextualMenuProps } from '../../../ContextualMenu';
import { IMenuButtonBaseProps, IMenuButtonBaseStyleProps, IMenuButtonBaseStyles } from './MenuButton.Base.types';

export interface IMenuButtonBaseState {
  menuIsOpen: boolean;
}
@customizable('MenuButtonBase', ['theme'])
export class MenuButtonBase extends BaseComponent<IMenuButtonBaseProps, IMenuButtonBaseState> {

  private _labelId: string;

  constructor(props: IMenuButtonBaseProps) {
    super(props);
    this._labelId = getId();

    this.state = {
      menuIsOpen: false
    };
  }

  public render(): JSX.Element {
    const {
      className,
      disabled,
      checked,
      theme,
      menuProps,
      getMenuStyles,
      onRenderMenu = this._onRenderMenu
    } = this.props;
    return (
      <ButtonBase
        onClick={ this._onMenuClick }
        onKeyDown={ this._onMenuKeyDown }
        labelId={ this._labelId }
        expanded={ this.state.menuIsOpen }
        aria-expanded={ this.state.menuIsOpen }
        {...this.props as IButtonBaseProps}
        getStyles={ getMenuStyles }
        data-target-id={ this._labelId }
      >
        { this.state.menuIsOpen && menuProps &&
          onRenderMenu(menuProps, this._onRenderMenu)
        }
      </ButtonBase>
    );
  }

  public dismissMenu(): void {
    this.setState({ menuIsOpen: false });
  }

  @autobind
  private _onRenderMenu(menuProps: IContextualMenuProps): JSX.Element {
    const {
      onDismiss = this._onToggleMenu,
      target = `[data-target-id='${this._labelId}']`
    } = menuProps;

    return (
      <ContextualMenu
        id={ this._labelId + '-menu' }
        directionalHint={ DirectionalHint.bottomLeftEdge }
        {...menuProps}
        className={ 'ms-BaseButton-menuhost ' + menuProps.className }
        target={ target }
        labelElementId={ this._labelId }
        onDismiss={ onDismiss }
      />
    );
  }

  @autobind
  private _onToggleMenu(): void {
    this.setState((prevState: IMenuButtonBaseState) => {
      return { menuIsOpen: !prevState.menuIsOpen };
    });
  }

  @autobind
  private _onMenuKeyDown(ev: React.KeyboardEvent<HTMLAnchorElement>) {
    if (ev.which === KeyCodes.down) {
      let { onMenuClick } = this.props;
      onMenuClick && onMenuClick(ev, this);
      !ev.defaultPrevented && this._onToggleMenu();
      ev.preventDefault();
      ev.stopPropagation();
    }
  }

  @autobind
  private _onMenuClick(ev: React.MouseEvent<HTMLAnchorElement>) {
    let { onMenuClick } = this.props;
    onMenuClick && onMenuClick(ev, this);
    !ev.defaultPrevented && this._onToggleMenu();
    ev.preventDefault();
    ev.stopPropagation();
  }
}