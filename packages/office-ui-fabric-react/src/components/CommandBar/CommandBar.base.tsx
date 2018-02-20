import * as React from 'react';
import {
  BaseComponent,
  css,
  autobind,
  customizable,
  nullRender
} from '../../Utilities';
import {
  ICommandBar,
  ICommandBarProps,
  ICommandBarItemProps,
  ICommandBarStyleProps,
  ICommandBarStyles
} from './CommandBar.types';
import { CommandBarButton, IButtonProps } from '../../Button';
import { OverflowSet, IOverflowSet } from '../../OverflowSet';
import { ResizeGroup, IResizeGroup } from '../../ResizeGroup';
import { TooltipHost } from '../../Tooltip';
import {
  classNamesFunction
} from '../../Utilities';

const getClassNames = classNamesFunction<ICommandBarStyleProps, ICommandBarStyles>();

export interface ICommandBarData {
  /**
   * Items being rendered in the primary region
   */
  primaryItems: ICommandBarItemProps[];
  /**
   * Items being rendered in the overflow
   */
  overflowItems: ICommandBarItemProps[];
  /**
   * Items being rendered on the far side
   */
  farItems: ICommandBarItemProps[] | undefined;
  /**
   * Length of original overflowItems to ensure that they are not moved into primary region on resize
   */
  minimumOverflowItems: number;
  /**
   * Unique string used to cache the width of the command bar
   */
  cacheKey: string;
}

@customizable('CommandBar', ['theme'])
export class CommandBarBase extends BaseComponent<ICommandBarProps, {}> implements ICommandBar {
  public static defaultProps: ICommandBarProps = {
    items: [],
    overflowItems: [],
    farItems: []
  };

  private _overflowSet: IOverflowSet;
  private _resizeGroup: IResizeGroup;
  private _classNames: {[key in keyof ICommandBarStyles]: string };

  public render(): JSX.Element {
    const {
      className,
      items,
      overflowItems,
      farItems,
      getStyles,
      theme,
      onReduceData = this._onReduceData,
      onGrowData = this._onGrowData,
    } = this.props;

    let commandBardata: ICommandBarData = {
      primaryItems: [...items],
      overflowItems: [...overflowItems!],
      minimumOverflowItems: [...overflowItems!].length, // for tracking
      farItems,
      cacheKey: '',
    };

    this._classNames = getClassNames(getStyles!, { theme: theme!, className });

    return (
      <ResizeGroup
        componentRef={ this._resolveRef('_resizeGroup') }
        className={ className }
        data={ commandBardata }
        onReduceData={ onReduceData }
        onGrowData={ onGrowData }
        onRenderData={ this._onRenderData }
      />
    );
  }

  public focus(): void {
    this._overflowSet.focus();
  }

  public remeasure(): void {
    this._resizeGroup.remeasure();
  }

  @autobind
  private _onRenderData(data: ICommandBarData): JSX.Element {
    return (
      <div className={ css(this._classNames.root) }>

        {/*Primary Items*/ }
        <OverflowSet
          componentRef={ this._resolveRef('_overflowSet') }
          className={ css(this._classNames.primarySet) }
          items={ data.primaryItems }
          overflowItems={ data.overflowItems.length ? data.overflowItems : undefined }
          onRenderItem={ this._onRenderItems }
          onRenderOverflowButton={ this._onRenderOverflowButton }
        />

        {/*Secondary Items*/ }
        <OverflowSet
          className={ css(this._classNames.secondarySet) }
          items={ data.farItems }
          onRenderItem={ this._onRenderItems }
          onRenderOverflowButton={ nullRender }
        />
      </div>
    );
  }

  @autobind
  private _onRenderItems(item: ICommandBarItemProps): JSX.Element | React.ReactNode {
    let {
      buttonAs: CommandButtonType = CommandBarButton
    } = this.props;

    if (item.onRender) {
      // These are the top level items, there is no relevant menu dismissing function to
      // provide for the IContextualMenuItem onRender function. Pass in a no op function instead.
      return item.onRender(item, () => undefined);
    }
    const commandButtonProps: ICommandBarItemProps = {
      ...item,
      styles: { root: { height: '100%' }, ...item.buttonStyles },
      className: css(item.className),
      text: !item.iconOnly ? item.name : '',
      menuProps: item.subMenuProps,
    };

    if (item.iconOnly && item.name !== undefined) {
      return (
        <TooltipHost content={ item.name } >
          <CommandButtonType { ...commandButtonProps } />
        </TooltipHost>
      );
    }

    return <CommandButtonType { ...commandButtonProps } />;
  }

  @autobind
  private _onRenderOverflowButton(overflowItems: ICommandBarItemProps[]): JSX.Element {
    const {
      overflowButtonAs: OverflowButtonType = CommandBarButton,
      overflowButtonProps = {} // assure that props is not empty
    } = this.props;

    const overflowProps: IButtonProps = {
      ...overflowButtonProps,
      styles: { menuIcon: { fontSize: '17px' }, ...overflowButtonProps.styles },
      className: css('ms-CommandBar-overflowButton', overflowButtonProps.className),
      menuProps: { items: overflowItems, ...overflowButtonProps.menuProps },
      menuIconProps: { iconName: 'More', ...overflowButtonProps.menuIconProps }
    };

    return <OverflowButtonType { ...overflowProps as IButtonProps } />;
  }

  private _computeCacheKey(primaryItems: ICommandBarItemProps[], farItems: ICommandBarItemProps[], overflow: boolean): string {
    const returnKey = (acc: string, current: ICommandBarItemProps): string => {
      const { cacheKey = current.key } = current;
      return acc + cacheKey;
    };

    const primaryKey = primaryItems.reduce(returnKey, '');
    const farKey = farItems.reduce(returnKey, '');
    const overflowKey = overflow ? 'overflow' : '';

    return [primaryKey, farKey, overflowKey].join(' ');
  }

  @autobind
  private _onReduceData(data: ICommandBarData): ICommandBarData | undefined {
    const { shiftOnReduce, onDataReduced } = this.props;
    let { primaryItems, overflowItems, cacheKey, farItems } = data;

    // Use first item if shiftOnReduce, otherwise use last item
    let movedItem = primaryItems[shiftOnReduce ? 0 : primaryItems.length - 1];

    if (movedItem !== undefined) {
      movedItem.renderedInOverflow = true;

      overflowItems = [movedItem, ...overflowItems];
      primaryItems = shiftOnReduce ? primaryItems.slice(1) : primaryItems.slice(0, -1);
      cacheKey = this._computeCacheKey(primaryItems, farItems!, !!overflowItems.length);

      if (onDataReduced) {
        onDataReduced(movedItem);
      }

      return { ...data, primaryItems, overflowItems, cacheKey };
    }

    return undefined;
  }

  @autobind
  private _onGrowData(data: ICommandBarData): ICommandBarData | undefined {
    const { shiftOnReduce, onDataGrown } = this.props;
    let { primaryItems, overflowItems, cacheKey, minimumOverflowItems, farItems } = data;
    const movedItem = overflowItems[0];

    // Make sure that moved item exists and is not one of the original overflow items
    if (movedItem !== undefined && overflowItems.length > minimumOverflowItems) {
      movedItem.renderedInOverflow = false;

      overflowItems = overflowItems.slice(1);
      // if shiftOnReduce, movedItem goes first, otherwise, last.
      primaryItems = shiftOnReduce ? [movedItem, ...primaryItems] : [...primaryItems, movedItem];
      cacheKey = this._computeCacheKey(primaryItems, farItems!, !!overflowItems.length);

      if (onDataGrown) {
        onDataGrown(movedItem);
      }

      return { ...data, primaryItems, overflowItems, cacheKey };
    }

    return undefined;
  }

}