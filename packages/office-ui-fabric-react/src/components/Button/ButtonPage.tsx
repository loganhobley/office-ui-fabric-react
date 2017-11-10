import * as React from 'react';
import {
  ExampleCard,
  IComponentDemoPageProps,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';

import { TestButtonExample } from './TestButton/TestButton.Example';
import { ComponentStatus } from '../../demo/ComponentStatus/ComponentStatus';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Link } from '../../Link';
import './examples/Button.Basic.Example.scss';
import * as exampleStylesImport from '../../common/_exampleStyles.scss';
const exampleStyles: any = exampleStylesImport;

export interface IButtonDemoPageState {
  areButtonsDisabled?: boolean;
  areButtonsChecked?: boolean;
}

export class ButtonPage extends React.Component<IComponentDemoPageProps, IButtonDemoPageState> {
  constructor() {
    super();
    this.state = {
      areButtonsDisabled: false,
      areButtonsChecked: false
    };
  }

  public render() {
    return (
      <ComponentPage
        title={ 'Button' }
        componentName='ButtonExample'
        exampleCards={
          <div>
            <Checkbox
              className={ exampleStyles.exampleCheckbox }
              label='Disable buttons'
              checked={ this.state.areButtonsDisabled }
              onChange={ this._onDisabledChanged.bind(this) }
            />
            <Checkbox
              className={ exampleStyles.exampleCheckbox }
              label='Mark as checked'
              checked={ this.state.areButtonsChecked }
              onChange={ this._onToggledChanged.bind(this) }
            />
            <ExampleCard title='Default Button'>
              <TestButtonExample disabled={ this.state.areButtonsDisabled } checked={ this.state.areButtonsChecked } />
            </ExampleCard>

          </div>
        }

        overview={
          <div />

        }
        bestPractices={
          <div />
        }

        isHeaderVisible={ false }

      />
    );
  }

  private _onDisabledChanged(ev: React.MouseEvent<HTMLElement>, disabled: boolean) {
    this.setState({
      areButtonsDisabled: disabled
    });
  }

  private _onToggledChanged(ev: React.MouseEvent<HTMLElement>, toggled: boolean) {
    this.setState({
      areButtonsChecked: toggled
    });
  }
}
