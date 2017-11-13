import * as React from 'react';
import {
  BaseComponent,
  getId,
  toMatrix
} from '../../Utilities';
import { FocusZone } from '../../FocusZone';
import { IGridProps } from './Grid.types';

export class Grid extends BaseComponent<IGridProps, {}> {

  private _id: string;

  constructor(props: IGridProps) {
    super(props);
    this._id = getId();
  }

  public render() {
    let {
      items,
      columnCount,
      onRenderItem,
      positionInSet,
      setSize
    } = this.props;

    // Array to store the cells in the correct row index
    let rowsOfItems: any[][] = toMatrix(items, columnCount);

    let content = (
      <table
        id={ this._id }
        role={ 'grid' }
        aria-posinset={ positionInSet }
        aria-setsize={ setSize }
        style={ { padding: '2px', outline: 'none' } }
      >
        <tbody>
          {
            rowsOfItems.map((rows: any[], rowIndex) => {
              return (
                <tr
                  role={ 'row' }
                  key={ this._id + '-' + rowIndex + '-row' }
                >
                  { rows.map((cell, cellIndex) => {
                    return (
                      <td
                        role={ 'presentation' }
                        key={ this._id + '-' + cellIndex + '-cell' }
                        style={ { padding: '0px' } }
                      >
                        { onRenderItem(cell, cellIndex) }
                      </td>
                    );
                  }) }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    );

    // Create the table/grid
    return (
      this.props.doNotContainWithinFocusZone ? content : (
        <FocusZone
          isCircularNavigation={ this.props.shouldFocusCircularNavigate }
          className={ this.props.containerClassName }
          onBlur={ this.props.onBlur }
        >
          { content }
        </FocusZone>
      ));
  }
}