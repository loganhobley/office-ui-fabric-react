/* tslint:disable:no-unused-variable */
import * as React from 'react';
/* tslint:enable:no-unused-variable */
import { ICalloutProps } from './Callout.Props';
import { DirectionalHint } from '../../common/DirectionalHint';
import {
  BaseComponent,
  IRectangle,
  assign,
  autobind,
  css,
  elementContains,
  focusFirstChild,
  getWindow,
  getDocument
} from '../../Utilities';
import { getRelativePositions, IPositionInfo, IPositionProps, getMaxHeight, RectangleEdge, CalloutLinkType } from '../../utilities/positioning';
import { Popup } from '../../Popup';
import * as stylesImport from './Callout.scss';
import { AnimationClassNames } from '../../Styling';

const styles: any = stylesImport;

const BEAK_ORIGIN_POSITION = { top: 0, left: 0 };
const OFF_SCREEN_STYLE = { opacity: 0 };
const BORDER_WIDTH: number = 1;
const SHADOW_SPREAD_MARGIN: number = 5; // keep in sync with scss variable

export interface ICalloutState {
  positions?: IPositionInfo;
  slideDirectionalClassName?: string;
  calloutElementRect?: ClientRect;
  heightOffset?: number;
}

export class CalloutContent extends BaseComponent<ICalloutProps, ICalloutState> {

  public static defaultProps = {
    preventDismissOnScroll: false,
    isBeakVisible: true,
    beakWidth: 16,
    gapSpace: 0,
    minPagePadding: 8,
    directionalHint: DirectionalHint.bottomAutoEdge
  };

  private _didSetInitialFocus: boolean;
  private _hostElement: HTMLDivElement;
  private _calloutElement: HTMLDivElement;
  private _targetWindow: Window;
  private _bounds: IRectangle;
  private _maxHeight: number;
  private _positionAttempts: number;
  private _target: HTMLElement | MouseEvent;
  private _setHeightOffsetTimer: number;

  constructor(props: ICalloutProps) {
    super(props);

    this._warnDeprecations({ 'beakStyle': 'beakWidth' });

    this._didSetInitialFocus = false;
    this.state = {
      positions: null,
      slideDirectionalClassName: null,
      calloutElementRect: null,
      heightOffset: 0
    };
    this._positionAttempts = 0;
  }

  public componentDidUpdate() {
    this._setInitialFocus();
    this._updatePosition();
  }

  public componentWillMount() {
    let target = this.props.targetElement ? this.props.targetElement : this.props.target;
    this._setTargetWindowAndElement(target);
  }

  public componentWillUpdate(newProps: ICalloutProps) {
    if (newProps.targetElement !== this.props.targetElement || newProps.target !== this.props.target) {
      let newTarget = newProps.targetElement ? newProps.targetElement : newProps.target;
      this._maxHeight = undefined;
      this._setTargetWindowAndElement(newTarget);
    }
    if (newProps.gapSpace !== this.props.gapSpace || this.props.beakWidth !== newProps.beakWidth) {
      this._maxHeight = undefined;
    }
  }

  public componentDidMount() {
    this._onComponentDidMount();
  }

  public render() {
    // If there is no target window then we are likely in server side rendering and we should not render anything.
    if (!this._targetWindow) {
      return null;
    }
    let {
      role,
      ariaLabel,
      ariaDescribedBy,
      ariaLabelledBy,
      className,
      target,
      targetElement,
      isBeakVisible,
      beakStyle,
      children,
      beakWidth,
      finalHeight,
      linkType,
      backgroundColor } = this.props;
    let { positions } = this.state;
    let beakStyleWidth = beakWidth;

    // This is here to support the old way of setting the beak size until version 1.0.0.
    // beakStyle is now deprecated and will be be removed at version 1.0.0
    if (beakStyle === 'ms-Callout-smallbeak') {
      beakStyleWidth = 16;
    }

    let beakReactStyle: React.CSSProperties = {
      top: positions && positions.beakPosition ? positions.beakPosition.top : BEAK_ORIGIN_POSITION.top,
      left: positions && positions.beakPosition ? positions.beakPosition.left : BEAK_ORIGIN_POSITION.left,
      height: beakStyleWidth,
      width: beakStyleWidth,
      backgroundColor: backgroundColor,
    };

    let isAttached = linkType === CalloutLinkType.attached;

    let attachedStyle: React.CSSProperties = isAttached && positions && {
      marginTop: positions.rectangleEdge === RectangleEdge.bottom ? 0 : SHADOW_SPREAD_MARGIN,
      marginBottom: positions.rectangleEdge === RectangleEdge.top ? 0 : SHADOW_SPREAD_MARGIN,
      marginLeft: positions.rectangleEdge === RectangleEdge.right ? 0 : SHADOW_SPREAD_MARGIN,
      marginRight: positions.rectangleEdge === RectangleEdge.left ? 0 : SHADOW_SPREAD_MARGIN
    };

    let directionalClassName = (positions && positions.directionalClassName)
      ? (AnimationClassNames as any)[positions.directionalClassName]
      : '';

    let contentMaxHeight: number = this._getMaxHeight() + this.state.heightOffset;
    // Temporary as isBeakVisible is deprecated.
    let beakVisible: boolean = (linkType !== undefined ? linkType === CalloutLinkType.beak : isBeakVisible) && (!!targetElement || !!target);
    let content = (
      <div
        ref={ this._resolveRef('_hostElement') }
        className={ css('ms-Callout-container', styles.container) }
      >
        <div
          className={
            css(
              'ms-Callout',
              styles.root,
              isAttached && styles.rootIsAttached,
              className,
              directionalClassName
            ) }
          style={ positions ? positions.calloutPosition : OFF_SCREEN_STYLE }
          ref={ this._resolveRef('_calloutElement') }
        >

          { beakVisible && (
            <div
              className={ css('ms-Callout-beak', styles.beak) }
              style={ beakReactStyle }
            />) }

          { beakVisible &&
            (<div className={ css('ms-Callout-beakCurtain', styles.beakCurtain) } />) }
          <Popup
            role={ role }
            ariaLabel={ ariaLabel }
            ariaDescribedBy={ ariaDescribedBy }
            ariaLabelledBy={ ariaLabelledBy }
            className={ css('ms-Callout-main', styles.main, isAttached && styles.mainIsAttached, {
              [styles.overFlowYHidden]: finalHeight
            }) }
            onDismiss={ this.dismiss }
            shouldRestoreFocus={ true }
            style={ Object.assign({ maxHeight: contentMaxHeight, backgroundColor: backgroundColor }, attachedStyle) }>
            { children }
          </Popup>
        </div>
      </div>
    );

    return content;
  }

  @autobind
  public dismiss(ev?: Event | React.MouseEvent<HTMLElement> | React.KeyboardEvent<HTMLElement>) {
    let { onDismiss } = this.props;

    if (onDismiss) {
      onDismiss(ev);
    }
  }

  protected _dismissOnScroll(ev: Event) {
    const { preventDismissOnScroll } = this.props;
    if (this.state.positions && !preventDismissOnScroll) {
      this._dismissOnLostFocus(ev);
    }
  }

  protected _dismissOnLostFocus(ev: Event) {
    let target = ev.target as HTMLElement;
    let clickedOutsideCallout = this._hostElement && !elementContains(this._hostElement, target);

    if (
      (!this._target && clickedOutsideCallout) ||
      ev.target !== this._targetWindow &&
      clickedOutsideCallout &&
      ((this._target as MouseEvent).stopPropagation ||
        (!this._target || (target !== this._target && !elementContains(this._target as HTMLElement, target))))) {
      this.dismiss(ev);
    }
  }

  @autobind
  protected _setInitialFocus() {
    if (this.props.setInitialFocus && !this._didSetInitialFocus && this.state.positions) {
      this._didSetInitialFocus = true;
      focusFirstChild(this._calloutElement);
    }
  }

  @autobind
  protected _onComponentDidMount() {
    // This is added so the callout will dismiss when the window is scrolled
    // but not when something inside the callout is scrolled. The delay seems
    // to be required to avoid React firing an async focus event in IE from
    // the target changing focus quickly prior to rendering the callout.
    this._async.setTimeout(() => {
      this._events.on(this._targetWindow, 'scroll', this._dismissOnScroll, true);
      this._events.on(this._targetWindow, 'resize', this.dismiss, true);
      this._events.on(this._targetWindow, 'focus', this._dismissOnLostFocus, true);
      this._events.on(this._targetWindow, 'click', this._dismissOnLostFocus, true);
    }, 0);

    if (this.props.onLayerMounted) {
      this.props.onLayerMounted();
    }

    this._updatePosition();
    this._setHeightOffsetEveryFrame();
  }

  private _updatePosition() {
    let { positions } = this.state;
    let hostElement: HTMLElement = this._hostElement;
    let calloutElement: HTMLElement = this._calloutElement;

    if (hostElement && calloutElement) {
      let currentProps: IPositionProps;
      currentProps = assign(currentProps, this.props);
      currentProps.bounds = this._getBounds();
      // Temporary to be removed when targetElement is removed. Currently deprecated.
      if (this.props.targetElement) {
        currentProps.targetElement = this._target as HTMLElement;
      } else {
        currentProps.target = this._target;
      }
      let newPositions: IPositionInfo = getRelativePositions(currentProps, hostElement, calloutElement);
      if (this.props.linkType === CalloutLinkType.attached) {
        if (newPositions.rectangleEdge === RectangleEdge.left) {
          newPositions.calloutPosition.left += SHADOW_SPREAD_MARGIN;
        } else {
          newPositions.calloutPosition.left -= SHADOW_SPREAD_MARGIN;
        }
      }

      // Set the new position only when the positions are not exists or one of the new callout positions are different.
      // The position should not change if the position is within 2 decimal places.
      if ((!positions && newPositions) ||
        (positions && newPositions && !this._arePositionsEqual(positions, newPositions)
          && this._positionAttempts < 5)) {
        // We should not reposition the callout more than a few times, if it is then the content is likely resizing
        // and we should stop trying to reposition to prevent a stack overflow.
        this._positionAttempts++;
        this.setState({
          positions: newPositions
        });
      } else {
        this._positionAttempts = 0;
        if (this.props.onPositioned) {
          this.props.onPositioned();
        }
      }
    }
  }

  private _getBounds(): IRectangle {
    if (!this._bounds) {
      let currentBounds = this.props.bounds;

      if (!currentBounds) {
        currentBounds = {
          top: 0 + this.props.minPagePadding,
          left: 0 + this.props.minPagePadding,
          right: this._targetWindow.innerWidth - this.props.minPagePadding,
          bottom: this._targetWindow.innerHeight - this.props.minPagePadding,
          width: this._targetWindow.innerWidth - this.props.minPagePadding * 2,
          height: this._targetWindow.innerHeight - this.props.minPagePadding * 2
        };
      }
      this._bounds = currentBounds;
    }
    return this._bounds;
  }

  private _getMaxHeight(): number {
    if (!this._maxHeight) {
      if (this.props.directionalHintFixed && this._target) {
        let beakWidth = (this.props.linkType !== undefined ? this.props.linkType === CalloutLinkType.beak : this.props.isBeakVisible)
          ? this.props.beakWidth
          : 0;
        let gapSpace = this.props.gapSpace ? this.props.gapSpace : 0;
        this._maxHeight = getMaxHeight(this._target, this.props.directionalHint, beakWidth + gapSpace, this._getBounds());
      } else {
        this._maxHeight = this._getBounds().height - BORDER_WIDTH * 2;
      }
    }
    return this._maxHeight;
  }

  private _arePositionsEqual(positions: IPositionInfo, newPosition: IPositionInfo) {
    if (positions.calloutPosition.top.toFixed(2) !== newPosition.calloutPosition.top.toFixed(2)) {
      return false;
    }
    if (positions.calloutPosition.left.toFixed(2) !== newPosition.calloutPosition.left.toFixed(2)) {
      return false;
    }
    if (positions.beakPosition.top.toFixed(2) !== newPosition.beakPosition.top.toFixed(2)) {
      return false;
    }
    if (positions.beakPosition.top.toFixed(2) !== newPosition.beakPosition.top.toFixed(2)) {
      return false;
    }

    return true;

  }

  private _setTargetWindowAndElement(target: HTMLElement | string | MouseEvent): void {
    if (target) {
      if (typeof target === 'string') {
        let currentDoc: Document = getDocument();
        this._target = currentDoc ? currentDoc.querySelector(target) as HTMLElement : null;
        this._targetWindow = getWindow();
      } else if ((target as MouseEvent).stopPropagation) {
        this._target = target;
        this._targetWindow = getWindow((target as MouseEvent).toElement as HTMLElement);
      } else {
        let targetElement: HTMLElement = target as HTMLElement;
        this._target = target;
        this._targetWindow = getWindow(targetElement);
      }
    } else {
      this._targetWindow = getWindow();
    }
  }

  private _setHeightOffsetEveryFrame(): void {
    if (this._calloutElement && this.props.finalHeight) {
      this._setHeightOffsetTimer = this._async.requestAnimationFrame(() => {
        const calloutMainElem = this._calloutElement.firstChild as HTMLElement;
        const cardScrollHeight: number = calloutMainElem.scrollHeight;
        const cardCurrHeight: number = calloutMainElem.offsetHeight;
        const scrollDiff: number = cardScrollHeight - cardCurrHeight;

        this.setState({
          heightOffset: this.state.heightOffset + scrollDiff
        });

        if (calloutMainElem.offsetHeight < this.props.finalHeight) {
          this._setHeightOffsetEveryFrame();
        } else {
          this._async.cancelAnimationFrame(this._setHeightOffsetTimer);
        }
      });
    }
  }
}
