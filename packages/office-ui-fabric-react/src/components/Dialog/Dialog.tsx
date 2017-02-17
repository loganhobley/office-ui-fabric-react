import * as React from 'react';
import {
  BaseComponent,
  css,
  getId
} from '../../Utilities';
import { FocusTrapZone } from '../FocusTrapZone/index';
import { IDialogProps, DialogType } from './Dialog.Props';
import { Overlay } from '../../Overlay';
import { Layer } from '../../Layer';
import { Button, ButtonType } from '../../Button';
import { Panel } from '../../Panel';
import { DialogFooter } from './DialogFooter';
import { Popup } from '../Popup/index';
import { withResponsiveMode, ResponsiveMode } from '../../utilities/decorators/withResponsiveMode';
import './Dialog.scss';

// @TODO - need to change this to a panel whenever the breakpoint is under medium (verify the spec)

export interface IDialogState {
  isOpen?: boolean;
  isAnimatingOpen?: boolean;
  isAnimatingClose?: boolean;
  id?: string;
}

@withResponsiveMode
export class Dialog extends BaseComponent<IDialogProps, IDialogState> {

  public static defaultProps: IDialogProps = {
    isOpen: false,
    type: DialogType.normal,
    isDarkOverlay: true,
    isBlocking: false,
    className: '',
    containerClassName: '',
    contentClassName: '',
    topButtonsProps: []
  };

  constructor(props: IDialogProps) {
    super(props);

    this._onDialogRef = this._onDialogRef.bind(this);

    this.state = {
      id: getId('Dialog'),
      isOpen: props.isOpen,
      isAnimatingOpen: props.isOpen,
      isAnimatingClose: false
    };
  }

  public componentWillReceiveProps(newProps: IDialogProps) {
    // Opening the dialog
    if (newProps.isOpen && !this.state.isOpen) {
      this.setState({
        isOpen: true,
        isAnimatingOpen: true,
        isAnimatingClose: false
      });
    }

    // Closing the dialog
    if (!newProps.isOpen && this.state.isOpen) {
      this.setState({
        isAnimatingOpen: false,
        isAnimatingClose: true
      });
    }
  }

  public render() {
    let {
      closeButtonAriaLabel,
      elementToFocusOnDismiss,
      firstFocusableSelector,
      forceFocusInsideTrap,
      ignoreExternalFocusing,
      isBlocking,
      isClickableOutsideFocusTrap,
      isDarkOverlay,
      onDismiss,
      onLayerDidMount,
      onLayerMounted,
      responsiveMode,
      subText,
      title,
      type
    } = this.props;
    let { id, isOpen, isAnimatingOpen, isAnimatingClose } = this.state;
    // @TODO - the discussion on whether the Dialog contain a property for rendering itself is still being discussed
    if (!isOpen) {
      return null;
    }

    let subTextContent;
    const dialogClassName = css('ms-Dialog', this.props.className, {
      'ms-Dialog--lgHeader': type === DialogType.largeHeader,
      'ms-Dialog--close': type === DialogType.close,
      'is-open': isOpen,
      'is-animatingOpen': isAnimatingOpen,
      'is-animatingClose': isAnimatingClose
    });




    // @temp tuatology - Will adjust this to be a panel at certain breakpoints
    return (
      responsiveMode >= ResponsiveMode.medium ?
        <Layer onLayerDidMount={ onLayerMounted || onLayerDidMount }>
          <Popup
            role='dialog'
            ariaLabelledBy={ title ? id + '-title' : '' }
            ariaDescribedBy={ subText ? id + '-subText' : '' }
            onDismiss={ onDismiss }
          >
            <div
              className={ dialogClassName }
              ref={ this._onDialogRef }>
              <Overlay isDarkThemed={ isDarkOverlay } onClick={ isBlocking ? null : onDismiss } />
              <FocusTrapZone
                className={ css('ms-Dialog-main', this.props.containerClassName) }
                elementToFocusOnDismiss={ elementToFocusOnDismiss }
                isClickableOutsideFocusTrap={ isClickableOutsideFocusTrap ? isClickableOutsideFocusTrap : !isBlocking }
                ignoreExternalFocusing={ ignoreExternalFocusing }
                forceFocusInsideTrap={ forceFocusInsideTrap }
                firstFocusableSelector={ firstFocusableSelector }>
                { this._onRenderContent(this.props) }
              </FocusTrapZone>
            </div>
          </Popup>
        </Layer>
        :
        <Panel
          className='ms-Dropdown-panel'
          isOpen={ true }
          isLightDismiss={ true }
          onDismiss={ onDismiss }
          hasCloseButton={ false }
        >
          { this._onRenderContent(this.props) }
        </Panel>
    );
  }

  private _onRenderContent(props: IDialogProps): JSX.Element {
    return (
      <div>
        <div className='ms-Dialog-header'>
          { this._onRenderHeader(this.props) }
        </div>
        <div className='ms-Dialog-inner'>
          { this._onRenderInner(this.props) }
        </div>
      </div>
    )
  }

  private _onRenderHeader(props: IDialogProps): JSX.Element {
    let { title, onDismiss, closeButtonAriaLabel } = this.props;
    let { id } = this.state;
    return (
      <div>
        <p className='ms-Dialog-title' id={ id + '-title' }>{ title }</p>
        <div className='ms-Dialog-topButton'>
          { this.props.topButtonsProps.map((props) => (
            <Button {...props} />
          )) }
          <Button
            className='ms-Dialog-button ms-Dialog-button--close'
            buttonType={ ButtonType.icon }
            icon='Cancel'
            ariaLabel={ closeButtonAriaLabel }
            onClick={ onDismiss }
          />
        </div>
      </div>
    );
  }

  private _onRenderInner(props: IDialogProps): JSX.Element {
    let { subText } = this.props;
    let { id } = this.state;
    let groupings = this._groupChildren();
    let subTextContent;
    if (subText) {
      subTextContent = <p className='ms-Dialog-subText' id={ id + '-subText' }>{ subText }</p>;
    }

    return (
      <div>
        <div className={ css('ms-Dialog-content', this.props.contentClassName) }>
          { subTextContent }
          { groupings.contents }
        </div>
        { groupings.footers }
      </div>
    );
  }

  // @TODO - typing the footers as an array of DialogFooter is difficult because
  // casing "child as DialogFooter" causes a problem because
  // "Neither type 'ReactElement<any>' nor type 'DialogFooter' is assignable to the other."
  private _groupChildren(): { footers: any[]; contents: any[]; } {

    let groupings: { footers: any[]; contents: any[]; } = {
      footers: [],
      contents: []
    };

    React.Children.map(this.props.children, child => {
      if (typeof child === 'object' && child !== null && child.type === DialogFooter) {
        groupings.footers.push(child);
      } else {
        groupings.contents.push(child);
      }
    });

    return groupings;
  }

  private _onDialogRef(ref: HTMLDivElement) {
    if (ref) {
      this._events.on(ref, 'animationend', this._onAnimationEnd);
    } else {
      this._events.off();
    }
  }

  // Watch for completed animations and set the state
  private _onAnimationEnd(ev: AnimationEvent) {

    // The dialog has just opened (faded in)
    if (ev.animationName.indexOf('fadeIn') > -1) {
      this.setState({
        isOpen: true,
        isAnimatingOpen: false
      });
    }

    // The dialog has just closed (faded out)
    if (ev.animationName.indexOf('fadeOut') > -1) {
      this.setState({
        isOpen: false,
        isAnimatingClose: false
      });

      // Call the onDismiss callback
      if (this.props.onDismissed) {
        this.props.onDismissed();
      }
    }
  }
}
