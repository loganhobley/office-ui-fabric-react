import * as React from 'react';
import { assign } from 'office-ui-fabric-react/lib/Utilities';
import { DetailsList, DetailsListLayoutMode, IColumn, IGroup } from 'office-ui-fabric-react/lib/DetailsList';
import { SelectionMode } from 'office-ui-fabric-react/lib/Selection';
import './PropertiesTable.scss';
import {
  IInterfaceProperty,
  IEnumProperty,
  InterfacePropertyType
} from '../../utilities/parser/index';
import { FontClassNames } from '@uifabric/styling/lib/index';

export interface IPropertiesTableProps {
  title?: string;
  properties: IInterfaceProperty[] | IEnumProperty[];
  renderAsEnum?: boolean;
  key?: string;
}

const DEFAULT_COLUMNS: IColumn[] = [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    minWidth: 150,
    maxWidth: 250,
    isCollapsable: false,
    isRowHeader: true,
    isResizable: true
  },
  {
    key: 'type',
    name: 'Type',
    fieldName: 'type',
    minWidth: 130,
    maxWidth: 150,
    isCollapsable: false,
    isResizable: true
  },
  {
    key: 'defaultValue',
    name: 'Default value',
    fieldName: 'defaultValue',
    minWidth: 130,
    maxWidth: 150,
    isCollapsable: false,
    isResizable: true
  }, {
    key: 'description',
    name: 'Description',
    fieldName: 'description',
    minWidth: 300,
    maxWidth: 400,
    isCollapsable: false,
    isResizable: true,
    isMultiline: true
  }
];

const ENUM_COLUMNS: IColumn[] = [
  {
    key: 'name',
    name: 'Name',
    fieldName: 'name',
    minWidth: 150,
    maxWidth: 250,
    isCollapsable: false,
    isRowHeader: true,
    isResizable: true
  },
  {
    key: 'description',
    name: 'Description',
    fieldName: 'description',
    minWidth: 300,
    maxWidth: 400,
    isCollapsable: false,
    isResizable: true
  }
];

export class PropertiesTable extends React.Component<IPropertiesTableProps, any> {
  public static defaultProps = {
    title: 'Properties'
  };

  constructor(props: IPropertiesTableProps) {
    super(props);

    let properties = (props.properties as any[])
      .sort((a, b) => (
        a.interfacePropertyType < b.interfacePropertyType ? -1 :
          a.interfacePropertyType > b.interfacePropertyType ? 1 :
            a.name < b.name ? -1 :
              a.name > b.name ? 1 :
                0
      ))
      .map((prop, index) => assign({}, prop, { key: index }));

    let groups = null;

    if (!props.renderAsEnum) {
      groups = this._getGroups(properties);
    }

    this.state = {
      properties,
      groups,
      isEnum: !!props.renderAsEnum
    };
  }

  public render() {
    let { title } = this.props;
    let { properties, isEnum, groups } = this.state;

    if (properties.length === 0) {
      return null;
    }

    return (
      <div className='PropertiesTable'>
        <h2 className={ FontClassNames.xLarge }>{ title }</h2>
        <DetailsList
          selectionMode={ SelectionMode.none }
          layoutMode={ DetailsListLayoutMode.justified }
          items={ properties }
          groups={ groups }
          columns={ isEnum ? ENUM_COLUMNS : DEFAULT_COLUMNS }
        />
      </div>
    );
  }

  private _getGroups(props: IInterfaceProperty[]) {
    let groups: IGroup[] = [];
    let index = 0;

    index = this._tryAddGroup(props, InterfacePropertyType.required, 'Required members', index, groups);
    index = this._tryAddGroup(props, InterfacePropertyType.optional, 'Optional members', index, groups);
    index = this._tryAddGroup(props, InterfacePropertyType.deprecated, 'Deprecated members', index, groups);

    return groups;
  }

  private _tryAddGroup(props, typeToCompare: InterfacePropertyType, name: string, index: number, allGroups): number {
    let group: IGroup;

    while (index < props.length) {
      let prop = props[index];

      if (prop.interfacePropertyType !== typeToCompare) {
        break;
      }

      if (!group) {
        group = {
          key: name,
          name,
          startIndex: index,
          count: 0
        };
        allGroups.push(group);
      }
      group.count++;
      index++;
    }

    return index;
  }
}