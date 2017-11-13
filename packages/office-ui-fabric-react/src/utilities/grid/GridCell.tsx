import * as React from 'react';
import {
  autobind,
  css,
  getId,
} from '../../Utilities';
import { IGridCellProps } from './GridCell.types';
import { CommandButton } from '../../Button';

export class GridCell<T, P extends IGridCellProps<T>> extends React.Component<P, {}> {

  public static defaultProps = {
    cellShape: 'circle',
    disabled: false,
    id: getId('gridCell')
  };

  public render() {
    let {
      item,
      id,
      className,
      role,
      selected,
      disabled,
      onRenderItem,
      cellDisabledStyle,
      cellIsSelectedStyle,
      index,
      label
    } = this.props;
    return (
      <CommandButton
        id={ id + '-item' + index }
        data-index={ index }
        data-is-focusable={ true }
        disabled={ disabled }
        className={ css(className,
          {
            ['' + cellIsSelectedStyle]: selected,
            ['' + cellDisabledStyle]: disabled
          }
        ) }
        onClick={ this._onClick }
        onMouseEnter={ this._onMouseEnter }
        onMouseLeave={ this._onMouseLeave }
        onFocus={ this._onFocus }
        role={ role }
        aria-selected={ selected }
        ariaLabel={ label }
        title={ label }
      >
        { onRenderItem(item) }
      </CommandButton >
    );
  }

  @autobind
  private _onClick() {
    let {
      onClick,
      disabled,
      item
      } = this.props as P;

    if (onClick && !disabled) {
      onClick(item);
    }
  }

  @autobind
  private _onMouseEnter() {
    let {
      onHover,
      disabled,
      item
      } = this.props as P;

    if (onHover && !disabled) {
      onHover(item);
    }
  }

  @autobind
  private _onMouseLeave() {
    let {
      onHover,
      disabled
      } = this.props as P;

    if (onHover && !disabled) {
      onHover();
    }
  }

  @autobind
  private _onFocus() {
    let {
      onFocus,
      disabled,
      item
      } = this.props as P;

    if (onFocus && !disabled) {
      onFocus(item);
    }
  }

}