import * as React from 'react';
import { ITextField, ITextFieldProps } from './TextField.Props';
import { Label } from '../../Label';
import {
  BaseComponent,
  getId,
  css,
  getNativeProps,
  inputProperties,
  textAreaProperties
} from '../../Utilities';
import styles from './TextField.scss';

export interface ITextFieldState {
  value?: string;

  /** Is true when the control has focus. */
  isFocused?: boolean;

  /**
   * The validation error message.
   *
   * - If there is no validation error or we have not validated the input value, errorMessage is an empty string.
   * - If we have done the validation and there is validation error, errorMessage is the validation error message.
   */
  errorMessage?: string;
}

export class TextField extends BaseComponent<ITextFieldProps, ITextFieldState> implements ITextField {
  public static defaultProps: ITextFieldProps = {
    multiline: false,
    resizable: true,
    autoAdjustHeight: false,
    underlined: false,
    onChanged: () => { /* noop */ },
    onBeforeChange: () => { /* noop */ },
    onNotifyValidationResult: () => { /* noop */ },
    onGetErrorMessage: () => undefined,
    deferredValidationTime: 200,
    errorMessage: '',
    validateOnFocusIn: false,
    validateOnFocusOut: false
  };

  private _id: string;
  private _descriptionId: string;
  private _delayedValidate: (value: string) => void;
  private _isMounted: boolean;
  private _lastValidation: number;
  private _latestValidateValue;
  private _willMountTriggerValidation;
  private _isDescriptionAvailable: boolean;
  private _textElement: HTMLInputElement | HTMLTextAreaElement;

  public constructor(props: ITextFieldProps) {
    super(props);

    this._id = getId('TextField');
    this._descriptionId = getId('TextFieldDescription');

    this.state = {
      value: props.value || props.defaultValue || '',
      isFocused: false,
      errorMessage: ''
    };

    this._onInputChange = this._onInputChange.bind(this);
    this._onFocus = this._onFocus.bind(this);
    this._onBlur = this._onBlur.bind(this);

    this._delayedValidate = this._async.debounce(this._validate, this.props.deferredValidationTime);
    this._lastValidation = 0;
    this._willMountTriggerValidation = false;
    this._isDescriptionAvailable = false;
  }

  /**
   * Gets the current value of the text field.
   */
  public get value(): string {
    return this.state.value;
  }

  public componentWillMount() {
    this._willMountTriggerValidation = true;
    this._validate(this.state.value);
  }

  public componentDidMount() {
    this._isMounted = true;
    this._adjustInputHeight();
  }

  public componentWillReceiveProps(newProps: ITextFieldProps) {
    const { onBeforeChange } = this.props;

    if (newProps.value !== undefined && newProps.value !== this.state.value) {
      if (onBeforeChange) {
        onBeforeChange(newProps.value);
      }

      this.setState({
        value: newProps.value,
        errorMessage: ''
      } as ITextFieldState);

      this._delayedValidate(newProps.value);
    }
  }

  public componentWillUnmount() {
    this._isMounted = false;
  }

  public render() {
    let {
      className,
      description,
      disabled,
      iconClass,
      label,
      multiline,
      required,
      underlined
    } = this.props;
    let { isFocused } = this.state;
    const errorMessage: string = this._errorMessage;
    this._isDescriptionAvailable = Boolean(description || errorMessage);

    const textFieldClassName = css('ms-TextField', styles.root, className, {
      ['is-required ' + styles.isRequired]: required,
      ['is-disabled ' + styles.isDisabled]: disabled,
      ['is-active ' + styles.isActive]: isFocused,
      ['ms-TextField--multiline ' + styles.isMultiline]: multiline,
      ['ms-TextField--underlined ' + styles.isUnderlined]: underlined
    });

    return (
      <div className={ textFieldClassName }>
        { label && <Label htmlFor={ this._id }>{ label }</Label> }
        { iconClass && <i className={ iconClass }></i> }
        { multiline ? this._renderTextArea() : this._renderInput() }
        { errorMessage && <div aria-live='assertive' className='ms-u-screenReaderOnly' data-automation-id='error-message'>{ errorMessage }</div> }
        { this._isDescriptionAvailable &&
          <span id={ this._descriptionId }>
            { description && <span className={ css('ms-TextField-description', styles.description) }>{ description }</span> }
            { errorMessage && (
              <p
                className={ css('ms-TextField-errorMessage ms-u-slideDownIn20', styles.errorMessage) }
              >
                { errorMessage }
              </p>) }
          </span>
        }
      </div>
    );
  }

  /**
   * Sets focus on the text field
   */
  public focus() {
    if (this._textElement) {
      this._textElement.focus();
    }
  }

  /**
   * Selects the text field
   */
  public select() {
    if (this._textElement) {
      this._textElement.select();
    }
  }

  /**
   * Sets the selection start of the text field to a specified value
   */
  public setSelectionStart(value: number) {
    if (this._textElement) {
      this._textElement.selectionStart = value;
    }
  }

  /**
   * Sets the selection end of the text field to a specified value
   */
  public setSelectionEnd(value: number) {
    if (this._textElement) {
      this._textElement.selectionEnd = value;
    }
  }

  private _onFocus(ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.props.onFocus) {
      this.props.onFocus(ev);
    }

    this.setState({ isFocused: true });
    if (this.props.validateOnFocusIn) {
      this._validate(this.state.value);
    }
  }

  private _onBlur(ev: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) {
    if (this.props.onBlur) {
      this.props.onBlur(ev);
    }

    this.setState({ isFocused: false });
    if (this.props.validateOnFocusOut) {
      this._validate(this.state.value);
    }
  }

  private _getTextElementClassName(): string {
    const errorMessage: string = this._errorMessage;
    let textFieldClassName: string;

    if (this.props.multiline && !this.props.resizable) {
      textFieldClassName = css('ms-TextField-field ms-TextField-field--unresizable', styles.field, styles.isUnresizable);
    } else {
      textFieldClassName = css('ms-TextField-field', styles.field);
    }

    return css(textFieldClassName, this.props.inputClassName, {
      ['ms-TextField-invalid ' + styles.invalid]: !!errorMessage
    });
  }

  private get _errorMessage(): string {
    let { errorMessage } = this.state;
    if (!errorMessage) {
      errorMessage = this.props.errorMessage;
    }

    return errorMessage;
  }

  private _renderTextArea(): React.ReactElement<React.HTMLProps<HTMLAreaElement>> {
    let textAreaProps = getNativeProps(this.props, textAreaProperties, ['defaultValue']);

    return (
      <textarea
        id={ this._id }
        { ...textAreaProps }
        ref={ this._resolveRef('_textElement') }
        value={ this.state.value }
        onInput={ this._onInputChange }
        onChange={ this._onChange }
        className={ this._getTextElementClassName() }
        aria-label={ this.props.ariaLabel }
        aria-describedby={ this._isDescriptionAvailable ? this._descriptionId : undefined }
        aria-invalid={ !!this.state.errorMessage }
        onFocus={ this._onFocus }
        onBlur={ this._onBlur }
      />
    );
  }

  private _renderInput(): React.ReactElement<React.HTMLProps<HTMLInputElement>> {
    let inputProps = getNativeProps<React.HTMLProps<HTMLInputElement>>(this.props, inputProperties, ['defaultValue']);

    return (
      <input
        type={ 'text' }
        id={ this._id }
        { ...inputProps }
        ref={ this._resolveRef('_textElement') }
        value={ this.state.value }
        onInput={ this._onInputChange }
        onChange={ this._onChange }
        className={ this._getTextElementClassName() }
        aria-label={ this.props.ariaLabel }
        aria-describedby={ this._isDescriptionAvailable ? this._descriptionId : undefined }
        aria-invalid={ !!this.state.errorMessage }
        onFocus={ this._onFocus }
        onBlur={ this._onBlur }
      />
    );
  }

  private _onInputChange(event: React.FormEvent<HTMLInputElement | HTMLTextAreaElement>): void {
    const element: HTMLInputElement = event.target as HTMLInputElement;
    const value: string = element.value;

    this.setState({
      value: value,
      errorMessage: ''
    } as ITextFieldState, this._adjustInputHeight);
    this._willMountTriggerValidation = false;
    const { validateOnFocusIn, validateOnFocusOut } = this.props;
    if (!(validateOnFocusIn || validateOnFocusOut)) {
      this._delayedValidate(value);
    }

    const { onBeforeChange } = this.props;
    onBeforeChange(value);
  }

  private _validate(value: string): void {
    // In case of _validate called multi-times during executing validate logic with promise return.
    if (this._latestValidateValue === value) {
      return;
    }

    this._latestValidateValue = value;
    let { onGetErrorMessage } = this.props;
    let result: string | PromiseLike<string> = onGetErrorMessage(value || '');

    if (result !== undefined) {
      if (typeof result === 'string') {
        this.setState({
          errorMessage: result
        } as ITextFieldState);
        this._notifyAfterValidate(value, result);
      } else {
        let currentValidation: number = ++this._lastValidation;

        result.then((errorMessage: string) => {
          if (this._isMounted && currentValidation === this._lastValidation) {
            this.setState({ errorMessage } as ITextFieldState);
          }
          this._notifyAfterValidate(value, errorMessage);
        });
      }
    } else {
      this._notifyAfterValidate(value, '');
    }
  }

  private _notifyAfterValidate(value: string, errorMessage: string): void {
    if (!this._willMountTriggerValidation && value === this.state.value) {
      const { onNotifyValidationResult } = this.props;
      onNotifyValidationResult(errorMessage, value);
      if (!errorMessage) {
        const { onChanged } = this.props;
        onChanged(value);
      }
    } else {
      this._willMountTriggerValidation = false;
    }
  }

  private _adjustInputHeight(): void {
    if (this._textElement && this.props.autoAdjustHeight && this.props.multiline) {
      const textField = this._textElement as HTMLElement;
      textField.style.height = '';
      let scrollHeight = textField.scrollHeight + 2; // +2 to avoid vertical scroll bars
      textField.style.height = scrollHeight + 'px';
    }
  }

  private _onChange(): void {
    /**
     * A noop input change handler.
     * https://github.com/facebook/react/issues/7027.
     * Using the native onInput handler fixes the issue but onChange
     * still need to be wired to avoid React console errors
     * TODO: Check if issue is resolved when React 16 is available.
     */
  }
}
