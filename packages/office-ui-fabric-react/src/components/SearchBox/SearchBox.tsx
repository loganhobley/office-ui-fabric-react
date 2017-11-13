import * as React from 'react';
import { ISearchBoxProps } from './SearchBox.types';
import {
  BaseComponent,
  autobind,
  css,
  getId,
  KeyCodes
} from '../../Utilities';

import { Icon } from '../../Icon';
import * as stylesImport from './SearchBox.scss';
const styles: any = stylesImport;

export interface ISearchBoxState {
  value?: string;
  hasFocus?: boolean;
  id?: string;
}

export class SearchBox extends BaseComponent<ISearchBoxProps, ISearchBoxState> {
  public static defaultProps: ISearchBoxProps = {
    labelText: 'Search',
  };

  private _rootElement: HTMLElement;
  private _inputElement: HTMLInputElement;
  private _latestValue: string;

  public constructor(props: ISearchBoxProps) {
    super(props);

    this.state = {
      value: props.value || '',
      hasFocus: false,
      id: getId('SearchBox')
    };
  }

  public componentWillReceiveProps(newProps: ISearchBoxProps) {
    if (newProps.value !== undefined) {
      this._latestValue = newProps.value;
      this.setState({
        value: newProps.value
      });
    }
  }

  public render() {
    let { labelText, className, disabled, underlined } = this.props;
    let { value, hasFocus, id } = this.state;
    return (
      <div
        ref={ this._resolveRef('_rootElement') }
        className={ css('ms-SearchBox', className, styles.root, {
          ['is-active ' + styles.rootIsActive]: hasFocus,
          ['is-disabled ' + styles.rootIsDisabled]: disabled,
          ['can-clear ' + styles.rootCanClear]: value!.length > 0,
          ['is-underlined ' + styles.rootIsUnderlined]: underlined,
        }) }
        { ...{ onFocusCapture: this._onFocusCapture } }
      >
        <div
          className={ css('ms-SearchBox-iconContainer', styles.iconContainer) }
        >
          <Icon className={ css('ms-SearchBox-icon', styles.icon) } iconName='Search' />
        </div>
        <input
          id={ id }
          className={ css('ms-SearchBox-field', styles.field) }
          placeholder={ labelText }
          onChange={ this._onInputChange }
          onInput={ this._onInputChange }
          onKeyDown={ this._onKeyDown }
          value={ value }
          disabled={ this.props.disabled }
          aria-label={ this.props.ariaLabel ? this.props.ariaLabel : this.props.labelText }
          ref={ this._resolveRef('_inputElement') }
        />
        <div
          className={ css('ms-SearchBox-clearButton', styles.clearButton) }
          onClick={ this._onClear }
        >
          <Icon iconName='Clear' />
        </div>
      </div>
    );
  }

  /**
   * Sets focus to the search box input field
   */
  public focus() {
    if (this._inputElement) {
      this._inputElement.focus();
    }
  }

  @autobind
  private _onClear(ev: React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) {
    this.props.onClear && this.props.onClear(ev);
    if (!ev.defaultPrevented) {
      this._latestValue = '';
      this.setState({
        value: ''
      });
      this._callOnChange('');
      ev.stopPropagation();
      ev.preventDefault();

      this._inputElement.focus();
    }

  }

  @autobind
  private _onFocusCapture(ev: React.FocusEvent<HTMLElement>) {
    this.setState({
      hasFocus: true
    });

    this._events.on(this._rootElement, 'blur', this._onBlur, true);

    if (this.props.onFocus) {
      this.props.onFocus(ev as React.FocusEvent<HTMLInputElement>);
    }
  }

  @autobind
  private _onKeyDown(ev: React.KeyboardEvent<HTMLInputElement>) {

    switch (ev.which) {

      case KeyCodes.escape:
        this.props.onEscape && this.props.onEscape(ev);
        if (!ev.defaultPrevented) {
          this._onClear(ev);
        }
        break;

      case KeyCodes.enter:
        if (this.props.onSearch && this.state.value!.length > 0) {
          this.props.onSearch(this.state.value);
        }
        break;

      default:
        this.props.onKeyDown && this.props.onKeyDown(ev);
        if (!ev.defaultPrevented) {
          return;
        }
    }

    // We only get here if the keypress has been handled,
    // or preventDefault was called in case of default keyDown handler
    ev.preventDefault();
    ev.stopPropagation();
  }

  @autobind
  private _onBlur(ev: React.FocusEvent<HTMLInputElement>) {
    this._events.off(this._rootElement, 'blur');
    this.setState({
      hasFocus: false
    });

    if (this.props.onBlur) {
      this.props.onBlur(ev);
    }
  }

  @autobind
  private _onInputChange(ev: React.ChangeEvent<HTMLInputElement>) {
    const value = this._inputElement.value;
    if (value === this._latestValue) {
      return;
    }
    this._latestValue = value;

    this.setState({ value });
    this._callOnChange(value);
  }

  private _callOnChange(newValue: string): void {
    let { onChange, onChanged } = this.props;

    // Call @deprecated method.
    if (onChanged) {
      onChanged(newValue);
    }

    if (onChange) {
      onChange(newValue);
    }
  }
}
