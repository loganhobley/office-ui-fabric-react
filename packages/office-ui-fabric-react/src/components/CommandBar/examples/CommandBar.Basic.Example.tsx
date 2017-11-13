import * as React from 'react';
import { ICommandBarProps, CommandBar } from 'office-ui-fabric-react/lib/CommandBar';

export class CommandBarBasicExample extends React.Component<ICommandBarProps, {}> {

  constructor(props: ICommandBarProps) {
    super(props);
    this.state = {
      areNamesVisible: true,
      areIconsVisible: true
    };
  }

  public render(): JSX.Element {
    let { items, overflowItems, farItems } = this.props;

    return (
      <div>
        <CommandBar
          elipisisAriaLabel='More options'
          items={ items }
          overflowItems={ overflowItems }
          farItems={ farItems }
        />
      </div>
    );
  }
}