import {
  IStyle,
  IStyleFunction,
  ITheme
} from '../../Styling';
import {
  IBreadcrumbItem
} from './Breadcrumb.props';

export interface ICrumbProps {
  as?: string | ((props: any) => JSX.Element);
  key?: string;
  theme?: ITheme;
  withChevron: boolean;
  item?: IBreadcrumbItem;
  menuProps?: any;
  iconProps?: any;
  getStyles?: IStyleFunction<ICrumbStyleProps, ICrumbStyles>;
}

export interface ICrumbStyleProps {
  theme: ITheme;
  isCurrentItem: boolean;
}

export interface ICrumbStyles {
  root: IStyle;
  overflowIcon: IStyle;
  crumbButton: IStyle;
  crumbLabel: IStyle;
  textContent: IStyle;
  chevron: IStyle;
}
