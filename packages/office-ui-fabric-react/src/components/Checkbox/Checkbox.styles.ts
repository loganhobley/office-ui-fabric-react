import { ICheckboxStyles } from './Checkbox.Props';
import {
  ITheme,
  mergeStyleSets,
  getFocusStyle
} from '../../Styling';
import { memoizeFunction } from '../../Utilities';

const MS_CHECKBOX_LABEL_SIZE = '20px';
const MS_CHECKBOX_TRANSITION_DURATION = '200ms';
const MS_CHECKBOX_TRANSITION_TIMING = 'cubic-bezier(.4, 0, .23, 1)';

export const getStyles = memoizeFunction((
  theme: ITheme,
  customStyles?: ICheckboxStyles
): ICheckboxStyles => {
  const { semanticColors, palette } = theme;
  const checkmarkFontColor = semanticColors.inputForegroundChecked;
  const checkmarkFontColorCheckedDisabled = semanticColors.disabledBackground;
  const checkboxBorderColor = semanticColors.inputBorder;
  const checkboxBorderHoveredColor = semanticColors.inputBorderHovered;
  const checkboxBackgroundChecked = semanticColors.inputBackgroundChecked;
  const checkboxBackgroundCheckedHovered = semanticColors.inputBackgroundCheckedHovered;
  const checkboxBackgroundDisabled = semanticColors.disabledText;
  const checkboxTextColorDisabled = semanticColors.disabledText;

  const styles: ICheckboxStyles = {
    root: [
      getFocusStyle(theme),
      {
        padding: '0',
        border: 'none',
        background: 'none',
        margin: '0',
        outline: 'none',
        display: 'block',
        cursor: 'pointer',

        // This is to hide the label's overflow because of the negative margin.
        overflow: 'hidden'
      }
    ],
    label: {
      display: 'inline-flex',
      alignItems: 'center',
      cursor: 'pointer',

      // The negative margin is in place to correct for the margin of the box
      margin: '0 -4px',
      position: 'relative',
      userSelect: 'none'
    },
    labelReversed: {
      flexDirection: 'row-reverse',
      justifyContent: 'flex-end'
    },
    labelDisabled: {
      cursor: 'default'
    },
    box: {
      display: 'flex',
      margin: '0 4px',
      alignItems: 'center',
      justifyContent: 'center',
      flex: '0 0 ' + MS_CHECKBOX_LABEL_SIZE,
      height: MS_CHECKBOX_LABEL_SIZE,
    },
    checkbox: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: MS_CHECKBOX_LABEL_SIZE,
      width: MS_CHECKBOX_LABEL_SIZE,
      borderWidth: '1px',
      borderStyle: 'solid',
      borderColor: checkboxBorderColor,
      boxSizing: 'border-box',
      transitionProperty: 'background, border, border-color',
      transitionDuration: MS_CHECKBOX_TRANSITION_DURATION,
      transitionTimingFunction: MS_CHECKBOX_TRANSITION_TIMING,

      /* incase the icon is bigger than the box */
      overflow: 'hidden',
    },
    checkboxHovered: {
      borderColor: checkboxBorderHoveredColor,
    },
    checkboxChecked: {
      background: checkboxBackgroundChecked,
    },
    checkboxCheckedHovered: {
      background: checkboxBackgroundCheckedHovered,
    },
    checkboxDisabled: {
      background: checkboxBackgroundDisabled,
    },
    checkboxCheckedDisabled: {
      background: checkboxBackgroundDisabled,
    },
    checkmark: {
      opacity: '0',
      color: checkmarkFontColor
    },
    checkmarkChecked: {
      opacity: '1'
    },
    checkmarkDisabled: {
    },
    checkmarkCheckedDisabled: {
      opacity: '1',
      color: checkmarkFontColorCheckedDisabled,
    },
    text: {
      margin: '0 4px'
    },
    textHovered: {
      color: palette.black,
    },
    textDisabled: {
      color: checkboxTextColorDisabled,   // ms-fontColor-neutralTertiary
    }
  };

  return mergeStyleSets(styles, customStyles);
});