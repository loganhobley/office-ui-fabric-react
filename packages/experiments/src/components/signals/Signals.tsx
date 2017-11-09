
import * as React from 'react';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import { css } from 'office-ui-fabric-react/lib/Utilities';
import * as SignalStylesModule from './Signals.scss';

// tslint:disable-next-line:no-any
const SignalStyles = SignalStylesModule as any;

export interface ISignalFieldProps extends React.HTMLAttributes<HTMLSpanElement> {
  before?: React.ReactNode | React.ReactNode[];
  after?: React.ReactNode | React.ReactNode[];
}

/**
 * Renders a field flanked by signals.
 * Pass `<Signal />` or related components in for the `before` and `after` fields.
 * Pass the main value as the children.
 */
export const SignalField: React.StatelessComponent<ISignalFieldProps> = (props: ISignalFieldProps): JSX.Element => {
  const {
    before,
    after,
    className,
    ...spanProps
  } = props;
  return (
    <span
      { ...spanProps }
      className={ css(SignalStyles.signalField, className) }
    >
      { props.before }
      <span className={ SignalStyles.signalFieldValue }>
        { props.children }
      </span>
      { props.after }
    </span>
  );
};

export interface ISignalProps extends React.HTMLAttributes<HTMLSpanElement> {
  ariaLabel?: string;
}

export type Signal = React.StatelessComponent<ISignalProps>;

export const Signal: Signal = (props: ISignalProps): JSX.Element => {
  const {
    ariaLabel,
    ...spanProps
  } = props;

  return (
    <span
      aria-label={ props.ariaLabel }
      { ...spanProps }
      className={ css(SignalStyles.signal) }
    >
      { props.children }
    </span>
  );
};

export const YouCheckedOutSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.youCheckedOutl) }
      iconName=''
    /> // TODO get correct icon
  );
};

export const BlockedSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.blocked) }
      iconName='blocked2'
    />
  );
};

export const MissingMetadataSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.missingMetadata) }
      iconName='info'
    />
  );
};

export const WarningSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.warning) }
      iconName='warning'
    />
  );
};

export const AwaitingApprovalSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.awaitingApproval) }
      iconName='documentmanagement'
    /> // TODO get correct icon
  );
};

export const TrendingSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <span className={ css(SignalStyles.signal, SignalStyles.centeredSignal) }>
      <Icon
        ariaLabel={ props.ariaLabel }
        className={ css(SignalStyles.signal, SignalStyles.trending) }
        iconName='market'
      />
    </span>
  );
};

export const SomeoneCheckedOutSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.someoneCheckedOut) }
      iconName='navigateforward'
    /> // TODO get correct icon
  );
};

/**
 * Renders a signal marking the proceeding content as new.
 */
export const NewSignal: Signal = (props: ISignalProps): JSX.Element => {
  const {
    ariaLabel,
    ...spanProps
  } = props;

  return (
    <span
      { ...spanProps }
      className={ css(SignalStyles.signal, SignalStyles.newItem) }
    >
      <Icon
        ariaLabel={ props.ariaLabel }
        className={ css(SignalStyles.newIcon) }
        iconName='glimmer'
      />
    </span>
  );
};

/**
 * Renders a signal for a live-edit scenario.
 */
export const LiveEditSignal: Signal = (props: ISignalProps): JSX.Element => {
  const {
    ariaLabel,
    ...spanProps
  } = props;

  return (
    <span
      aria-label={ ariaLabel }
      { ...spanProps }
      className={ css(SignalStyles.signal, SignalStyles.liveEdit) }
    >
      { props.children }
    </span>
  );
};

export const MentionSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.mention) }
      iconName='accounts'
    />
  );
};

/**
 * Renders a signal for a number of comments.
 */
export const CommentsSignal: Signal = (props: ISignalProps): JSX.Element => {
  const {
    ariaLabel,
    ...spanProps
  } = props;

  return (
    <span
      { ...spanProps }
      className={ css(SignalStyles.signal, SignalStyles.comments) }
    >
      <Icon
        ariaLabel={ props.ariaLabel }
        className={ css(SignalStyles.commentsIcon) }
        iconName='MessageFill'
      />
      {
        props.children ? (
          <span className={ css(SignalStyles.commentsCount) }>
            { props.children }
          </span>
        ) : null
      }
    </span>
  );
};

export const UnseenEditSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.unseenEdit) }
      iconName='edit'
    /> // TODO get correct icon
  );
};

export const ReadOnlySignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.readOnly) }
      iconName=''
    /> // TODO get correct icon
  );
};

export const SharedSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.shared) }
      iconName='people'
    />
  );
};

export const ATPSignal: Signal = (props: ISignalProps): JSX.Element => {
  return (
    <Icon
      ariaLabel={ props.ariaLabel }
      className={ css(SignalStyles.signal, SignalStyles.atp) }
      iconName='ATPLogo'
    />
  );
};