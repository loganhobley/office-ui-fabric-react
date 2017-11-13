import * as React from 'react';
import {
  autobind,
  css,
  divProperties,
  getInitials,
  getNativeProps,
  getRTL
} from '../../Utilities';
import { Image, ImageFit, ImageLoadState } from '../../Image';
import { PersonaPresence } from './PersonaPresence';
import {
  IPersonaProps,
  PersonaPresence as PersonaPresenceEnum,
  PersonaInitialsColor,
  PersonaSize
} from './Persona.types';
import {
  PERSONA_INITIALS_COLOR,
  PERSONA_SIZE
} from './PersonaConsts';
import {
  Icon
} from '../../Icon';
import * as stylesImport from './Persona.scss';
const styles: any = stylesImport;

const SIZE_TO_PIXELS = {
  [PersonaSize.tiny]: 20,
  [PersonaSize.extraExtraSmall]: 24,
  [PersonaSize.extraSmall]: 28,
  [PersonaSize.small]: 40,
  [PersonaSize.regular]: 48,
  [PersonaSize.large]: 72,
  [PersonaSize.extraLarge]: 100,

  [PersonaSize.size24]: 24,
  [PersonaSize.size28]: 28,
  [PersonaSize.size10]: 20,
  [PersonaSize.size32]: 32,
  [PersonaSize.size40]: 40,
  [PersonaSize.size48]: 48,
  [PersonaSize.size72]: 72,
  [PersonaSize.size100]: 100
};

/**
 * These colors are considered reserved colors and can only be set with overrides:
 * - Red is a color that often has a special meaning.
 * - Transparent is not intended to be used with typical initials due to accessibility issues,
 *   its primary use is for Facepile overflow buttons.
 */
const COLOR_SWATCHES_LOOKUP: PersonaInitialsColor[] = [
  PersonaInitialsColor.lightGreen,
  PersonaInitialsColor.lightBlue,
  PersonaInitialsColor.lightPink,
  PersonaInitialsColor.green,
  PersonaInitialsColor.darkGreen,
  PersonaInitialsColor.pink,
  PersonaInitialsColor.magenta,
  PersonaInitialsColor.purple,
  PersonaInitialsColor.black,
  PersonaInitialsColor.teal,
  PersonaInitialsColor.blue,
  PersonaInitialsColor.darkBlue,
  PersonaInitialsColor.orange,
  PersonaInitialsColor.darkRed
];

const COLOR_SWATCHES_NUM_ENTRIES = COLOR_SWATCHES_LOOKUP.length;

export interface IPersonaState {
  isImageLoaded?: boolean;
  isImageError?: boolean;
}

export class PersonaCoin extends React.Component<IPersonaProps, IPersonaState> {
  public static defaultProps: IPersonaProps = {
    primaryText: '',
    size: PersonaSize.size48,
    presence: PersonaPresenceEnum.none,
    imageAlt: ''
  };

  constructor(props: IPersonaProps) {
    super(props);

    this.state = {
      isImageLoaded: false,
      isImageError: false
    };
  }

  public render(): JSX.Element | null {
    let {
      coinProps,
      coinSize,
      imageUrl,
      imageAlt,
      initialsColor,
      primaryText,
      imageShouldFadeIn,
      onRenderInitials = this._onRenderInitials,
      imageShouldStartVisible
     } = this.props;

    let size = this.props.size as PersonaSize;
    let divProps = getNativeProps(this.props, divProperties);
    let coinSizeStyle = coinSize ? { width: coinSize, height: coinSize } : undefined;

    initialsColor = initialsColor !== undefined && initialsColor !== null ? initialsColor : this._getColorFromName(primaryText);

    return (
      <div
        { ...divProps }
        className={ css('ms-Persona-coin', PERSONA_SIZE[size]) }
      >
        { (size !== PersonaSize.size10 && size !== PersonaSize.tiny) ? (
          <div
            { ...coinProps }
            className={ css('ms-Persona-imageArea', styles.imageArea) }
            style={ coinSizeStyle }
          >
            {
              !this.state.isImageLoaded &&
              (!imageUrl || this.state.isImageError) &&
              (
                <div
                  className={ css(
                    'ms-Persona-initials',
                    styles.initials,
                    PERSONA_INITIALS_COLOR[initialsColor]
                  ) }
                  style={ coinSizeStyle }
                  aria-hidden='true'
                >
                  { onRenderInitials(this.props, this._onRenderInitials) }
                </div>
              )
            }
            <Image
              className={ css('ms-Persona-image', styles.image) }
              imageFit={ ImageFit.cover }
              src={ imageUrl }
              width={ coinSize || SIZE_TO_PIXELS[size] }
              height={ coinSize || SIZE_TO_PIXELS[size] }
              alt={ imageAlt }
              shouldFadeIn={ imageShouldFadeIn }
              shouldStartVisible={ imageShouldStartVisible }
              onLoadingStateChange={ this._onPhotoLoadingStateChange }
            />
            <PersonaPresence { ...this.props } />
          </div>
        ) :
          (this.props.presence ?
            <PersonaPresence
              { ...this.props }
            /> :
            <Icon
              iconName='Contact'
              className={ styles.size10NoPresenceIcon }
            />
          )
        }
        { this.props.children }
      </div>
    );
  }

  private _getColorFromName(displayName: string | undefined): PersonaInitialsColor {
    let color = PersonaInitialsColor.blue;
    if (!displayName) {
      return color;
    }

    let hashCode = 0;
    for (let iLen: number = displayName.length - 1; iLen >= 0; iLen--) {
      const ch: number = displayName.charCodeAt(iLen);
      const shift: number = iLen % 8;
      // tslint:disable-next-line:no-bitwise
      hashCode ^= (ch << shift) + (ch >> (8 - shift));
    }

    color = COLOR_SWATCHES_LOOKUP[hashCode % COLOR_SWATCHES_NUM_ENTRIES];

    return color;
  }

  @autobind
  private _onRenderInitials(props: IPersonaProps): JSX.Element {
    let {
      imageInitials,
      primaryText
    } = props;

    let isRTL = getRTL();

    imageInitials = imageInitials || getInitials(primaryText, isRTL);

    return (
      <span>{ imageInitials }</span>
    );
  }

  @autobind
  private _onPhotoLoadingStateChange(loadState: ImageLoadState) {
    this.setState({
      isImageLoaded: loadState === ImageLoadState.loaded,
      isImageError: loadState === ImageLoadState.error
    });
  }
}