import * as React from 'react';
import { DefaultButton } from 'office-ui-fabric-react/lib/Button';
import { Callout, DirectionalHint, CalloutLinkType } from 'office-ui-fabric-react/lib/Callout';
import { Dropdown, IDropdownOption } from 'office-ui-fabric-react/lib/Dropdown';
import { ChoiceGroup, IChoiceGroupOption } from 'office-ui-fabric-react/lib/ChoiceGroup';
import { Slider } from 'office-ui-fabric-react/lib/Slider';
import { autobind } from 'office-ui-fabric-react/lib/Utilities';
import './CalloutExample.scss';

export interface ICalloutDirectionalExampleState {
  isCalloutVisible?: boolean;
  directionalHint?: DirectionalHint;
  linkType?: CalloutLinkType;
  gapSpace?: number;
  beakWidth?: number;
}

const DIRECTION_OPTIONS = [
  { key: DirectionalHint[DirectionalHint.topLeftEdge], text: 'Top Left Edge' },
  { key: DirectionalHint[DirectionalHint.topCenter], text: 'Top Center' },
  { key: DirectionalHint[DirectionalHint.topRightEdge], text: 'Top Right Edge' },
  { key: DirectionalHint[DirectionalHint.topAutoEdge], text: 'Top Auto Edge' },
  { key: DirectionalHint[DirectionalHint.bottomLeftEdge], text: 'Bottom Left Edge' },
  { key: DirectionalHint[DirectionalHint.bottomCenter], text: 'Bottom Center' },
  { key: DirectionalHint[DirectionalHint.bottomRightEdge], text: 'Bottom Right Edge' },
  { key: DirectionalHint[DirectionalHint.bottomAutoEdge], text: 'Bottom Auto Edge' },
  { key: DirectionalHint[DirectionalHint.leftTopEdge], text: 'Left Top Edge' },
  { key: DirectionalHint[DirectionalHint.leftCenter], text: 'Left Center' },
  { key: DirectionalHint[DirectionalHint.leftBottomEdge], text: 'Left Bottom Edge' },
  { key: DirectionalHint[DirectionalHint.rightTopEdge], text: 'Right Top Edge' },
  { key: DirectionalHint[DirectionalHint.rightCenter], text: 'Right Center' },
  { key: DirectionalHint[DirectionalHint.rightBottomEdge], text: 'Right Bottom Edge' },
];

export class CalloutDirectionalExample extends React.Component<any, ICalloutDirectionalExampleState> {
  private _menuButtonElement: HTMLElement;
  public constructor() {
    super();

    this.state = {
      isCalloutVisible: false,
      linkType: CalloutLinkType.beak,
      directionalHint: DirectionalHint.bottomLeftEdge
    };
  }

  public render() {
    let { isCalloutVisible, linkType, directionalHint, gapSpace, beakWidth } = this.state;
    //  ms-Callout-smallbeak is used in this directional example to reflect all the positions. Large beak will disable some position to avoid beak over the callout edge.
    return (
      <div className='ms-CalloutExample'>
        <div className='ms-CalloutExample-configArea'>
          <ChoiceGroup
            label='Link type'
            selectedKey={ linkType.toString() }
            options={ [
              {
                key: CalloutLinkType.none.toString(),
                text: 'None'
              },
              {
                key: CalloutLinkType.beak.toString(),
                text: 'Beak'
              },
              {
                key: CalloutLinkType.attached.toString(),
                text: 'Attached'
              }
            ] }
            onChange={ this._onShowBeakChange }
          />
          <Slider
            max={ 30 }
            label='Gap Space'
            min={ 0 }
            defaultValue={ 0 }
            onChange={ this._onGapSlider } />
          { linkType === CalloutLinkType.beak &&
            (<Slider
              max={ 50 }
              label='Beak Width'
              min={ 10 }
              defaultValue={ 16 }
              onChange={ this._onBeakWidthSlider } />) }
          <Dropdown
            label='Directional hint'
            selectedKey={ DirectionalHint[directionalHint] }
            options={ DIRECTION_OPTIONS }
            onChanged={ this._onDirectionalChanged } />
        </div>
        <div className='ms-CalloutExample-buttonArea' ref={ (menuButton) => this._menuButtonElement = menuButton }>
          <DefaultButton
            onClick={ this._onShowMenuClicked }
            text={ isCalloutVisible ? 'Hide callout' : 'Show callout' }
          />
        </div>
        { isCalloutVisible ? (
          <Callout
            className='ms-CalloutExample-callout'
            gapSpace={ gapSpace }
            targetElement={ this._menuButtonElement }
            linkType={ linkType }
            beakWidth={ beakWidth }
            onDismiss={ this._onCalloutDismiss }
            directionalHint={ directionalHint }
          >
            <div className='ms-CalloutExample-header'>
              <p className='ms-CalloutExample-title'>
                All of your favorite people
              </p>
            </div>
            <div className='ms-CalloutExample-inner'>
              <div className='ms-CalloutExample-content'>
                <p className='ms-CalloutExample-subText'>
                  Message body is optional. If help documentation is available, consider adding a link to learn more at the bottom.
                </p>
              </div>
            </div>
          </Callout>
        ) : (null) }
      </div>
    );
  }

  @autobind
  private _onCalloutDismiss() {
    this.setState({
      isCalloutVisible: false
    });
  }

  @autobind
  private _onShowMenuClicked() {
    this.setState({
      isCalloutVisible: !this.state.isCalloutVisible
    });
  }

  @autobind
  private _onShowBeakChange(ev: React.FormEvent<HTMLElement>, option: IChoiceGroupOption) {
    this.setState({
      linkType: parseInt(option.key, 10),
      beakWidth: parseInt(option.key, 10) === CalloutLinkType.beak ? 16 : 0
    });
  }

  @autobind
  private _onDirectionalChanged(option: IDropdownOption) {
    this.setState({
      directionalHint: (DirectionalHint as any)[option.key]
    });
  }

  @autobind
  private _onGapSlider(value: number) {
    this.setState({
      gapSpace: value
    });
  }

  @autobind
  private _onBeakWidthSlider(value: number) {
    this.setState({
      beakWidth: value
    });
  }
}