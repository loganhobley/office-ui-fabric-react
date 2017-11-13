import * as React from 'react';
import { LayerHost } from 'office-ui-fabric-react/lib/Layer';
import {
  ExampleCard,
  ComponentPage,
  PropertiesTableSet
} from '@uifabric/example-app-base';
import { OverflowSetCustomExample } from './examples/OverflowSet.Custom.Example';
import { OverflowSetBasicExample } from './examples/OverflowSet.Basic.Example';
import { OverflowSetVerticalExample } from './examples/OverflowSet.Vertical.Example';
import { ComponentStatus } from '../../demo/ComponentStatus/ComponentStatus';
import { OverflowSetStatus } from './OverflowSet.checklist';

const OverflowSetCustomExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/OverflowSet/examples/OverflowSet.Custom.Example.tsx') as string;
const OverflowSetBasicExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/OverflowSet/examples/OverflowSet.Basic.Example.tsx') as string;
const OverflowSetVerticalExampleCode = require('!raw-loader!office-ui-fabric-react/src/components/OverflowSet/examples/OverflowSet.Vertical.Example.tsx') as string;

export class OverflowSetPage extends React.Component<any, any> {
  public render() {
    return (
      <ComponentPage
        title='OverflowSet'
        componentName='OverflowSetExample'
        overview={
          <div>
            <p>
              The OverflowSet is a flexible container component that is useful for displaying a primary set of content with additional content in an overflow callout.
              Note that the example below is only an example of how to render the component, not a specific use case.
            </p>
          </div>
        }
        exampleCards={
          <LayerHost>
            <ExampleCard title='OverflowSet Basic Example' code={ OverflowSetBasicExampleCode }>
              <OverflowSetBasicExample />
            </ExampleCard>
            <ExampleCard title='OverflowSet Vertical Example' code={ OverflowSetVerticalExampleCode }>
              <OverflowSetVerticalExample />
            </ExampleCard>
            <ExampleCard title='OverflowSet Custom Example' code={ OverflowSetCustomExampleCode }>
              <OverflowSetCustomExample />
            </ExampleCard>
          </LayerHost>
        }
        propertiesTables={
          <PropertiesTableSet
            sources={ [
              require<string>('!raw-loader!office-ui-fabric-react/src/components/OverflowSet/OverflowSet.types.ts')
            ] }
          />
        }
        componentStatus={
          <ComponentStatus
            {...OverflowSetStatus}
          />
        }
      />
    );
  }
}
