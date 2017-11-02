import * as React from 'react';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import {
  IPersonaProps,
  Persona,
  PersonaSize,
  PersonaPresence
} from 'office-ui-fabric-react/lib/Persona';
import { Icon } from 'office-ui-fabric-react/lib/Icon';
import './PersonaExample.scss';
import { TestImages } from '../../../common/TestImages';

const examplePersona = {
  imageUrl: TestImages.personaFemale,
  imageInitials: 'AL',
  primaryText: 'Annie Lindqvist',
  secondaryText: 'Software Engineer',
  tertiaryText: 'In a meeting',
  optionalText: 'Available at 4:00pm'
};

export class PersonaCustomRenderExample extends React.Component<React.Props<PersonaCustomRenderExample>, any> {
  constructor() {
    super();
  }

  public render() {
    return (
      <div>
        <Persona
          { ...examplePersona }
          size={ PersonaSize.size72 }
          presence={ PersonaPresence.offline }
          onRenderSecondaryText={ this._onRenderSecondaryText }
        />
        <div>custom coin size = 150, Persona size is size100.</div>
        <Persona
          { ...examplePersona }
          size={ PersonaSize.size100 }
          coinSize={ 150 }
          presence={ PersonaPresence.offline }
          onRenderSecondaryText={ this._onRenderSecondaryText }
        />
      </div>
    );
  }

  @autobind
  private _onRenderSecondaryText(props: IPersonaProps): JSX.Element {
    return (
      <div>
        <Icon iconName={ 'Suitcase' } className={ 'ms-JobIconExample' } />
        { props.secondaryText }
      </div>
    );
  }
}
