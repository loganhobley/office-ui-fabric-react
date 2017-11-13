/* tslint:disable */
import * as React from 'react';
/* tslint:enable */
import { IIconProps, IconType } from './Icon.types';
import { Image } from '../Image/Image';
import {
  css,
  getNativeProps,
  htmlElementProperties
} from '../../Utilities';
import { getIcon, IIconRecord } from '../../Styling';
import { getClassNames } from './Icon.classNames';

export const Icon = (props: IIconProps): JSX.Element => {
  let {
    ariaLabel,
    className,
    styles,
    iconName
   } = props;
  let classNames = getClassNames(
    styles
  );

  if (props.iconType === IconType.image || props.iconType === IconType.Image) {
    let containerClassName = css(
      'ms-Icon',
      'ms-Icon-imageContainer',
      classNames.root,
      classNames.imageContainer,
      className
    );

    return (
      <div
        className={
          css(
            containerClassName,
            classNames.root
          ) }
      >
        <Image { ...props.imageProps as any } />
      </div>
    );
  } else if (typeof iconName === 'string' && iconName.length === 0) {
    return (
      <i
        aria-label={ ariaLabel }
        { ...(ariaLabel ? {} : {
          role: 'presentation',
          'aria-hidden': true
        }) }
        { ...getNativeProps(props, htmlElementProperties) }
        className={
          css(
            'ms-Icon ms-Icon-placeHolder',
            classNames.rootHasPlaceHolder,
            props.className
          ) }
      />
    );
  } else {
    let iconDefinition = getIcon(iconName) || {
      subset: {
        className: undefined
      },
      code: undefined
    };

    return (
      <i
        aria-label={ ariaLabel }
        { ...(ariaLabel ? {} : {
          role: 'presentation',
          'aria-hidden': true,
          'data-icon-name': iconName,
        }) }
        { ...getNativeProps(props, htmlElementProperties) }
        className={
          css(
            'ms-Icon', // dangerous?
            iconDefinition.subset.className,
            classNames.root,
            props.className
          ) }
      >
        { iconDefinition.code }
      </i>
    );
  }
};
