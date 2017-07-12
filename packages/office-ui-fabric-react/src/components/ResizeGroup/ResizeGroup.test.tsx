import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { shallow } from 'enzyme';
import { expect } from 'chai';
import { ResizeGroup, IResizeGroupState, getNextResizeGroupStateProvider, getMeasurementCache } from './ResizeGroup';
import { IResizeGroupProps } from './ResizeGroup.Props';
import * as sinon from 'sinon';

interface ITestScalingData {
  scalingIndex: number;
}

function onReduceScalingData(data: ITestScalingData): ITestScalingData {
  return {
    scalingIndex: data.scalingIndex - 1
  };
}

function getRequiredResizeGroupProps() {
  return {
    data: {},
    onReduceData: sinon.stub(),
    onRenderData: sinon.stub()
  };
}

describe('ResizeGroup', () => {
  it('renders the result of onRenderData', () => {
    const initialData = { content: 5 };
    const renderedDataId = 'onRenderDataId';
    const onRenderData = (data: any) => <div id={ renderedDataId }> Rendered data: { data.content }</div >;

    const wrapper = shallow<IResizeGroupProps, IResizeGroupState>(
      <ResizeGroup
        data={ initialData }
        onReduceData={ onReduceScalingData }
        onRenderData={ onRenderData }
      />
    );

    expect(wrapper.containsMatchingElement(onRenderData(initialData))).to.equal(true);
  });

  describe('getNextResizeGroupStateProvider', () => {
    it('does not provide a new state when there is no container width provided or data to measure', () => {
      const resizeGroupProps = getRequiredResizeGroupProps();
      const resizeGroupState: IResizeGroupState = {};
      const getNextResizeGroupState = getNextResizeGroupStateProvider();
      const getMeasuredElementWidthStub = sinon.stub();

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        getMeasuredElementWidthStub);

      expect(result).to.equal(undefined);
      expect(getMeasuredElementWidthStub.callCount).to.equal(0);
    });
    it('sets the renderedData when the contents fit', () => {
      const dataToMeasure = { foo: 'bar' };
      const resizeGroupProps = getRequiredResizeGroupProps();
      const resizeGroupState: IResizeGroupState = { dataToMeasure };
      const getNextResizeGroupState = getNextResizeGroupStateProvider();
      const getMeasuredElementWidthStub = sinon.stub();
      getMeasuredElementWidthStub.returns(25);

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        getMeasuredElementWidthStub,
        50);

      expect(result).to.deep.equal({
        renderedData: dataToMeasure,
        measureContainer: false,
        dataToMeasure: undefined,
      });
      expect(getMeasuredElementWidthStub.callCount).to.equal(1);
    });
    it('calls onReduceData and sets the next measuredData when contents do not fit', () => {
      const dataToMeasure = { index: 5 };
      const resizeGroupProps = getRequiredResizeGroupProps();
      const resizeGroupState: IResizeGroupState = { dataToMeasure };
      resizeGroupProps.onReduceData.returns({ index: 4 });
      const getNextResizeGroupState = getNextResizeGroupStateProvider();
      const getMeasuredElementWidthStub = sinon.stub();
      getMeasuredElementWidthStub.returns(25);

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        getMeasuredElementWidthStub,
        10);

      expect(result).to.deep.equal({
        measureContainer: false,
        dataToMeasure: { index: 4 },
      });
      expect(getMeasuredElementWidthStub.callCount).to.equal(1);
    });
    it('does not call getmeasuredElementBounds when the data has already been cached', () => {
      const dataToMeasure = { index: 5, cacheKey: 'foo' };

      let measurementCache = getMeasurementCache();
      measurementCache.addMeasurementToCache(dataToMeasure, 40);
      const getNextResizeGroupState = getNextResizeGroupStateProvider(measurementCache);

      const resizeGroupProps = getRequiredResizeGroupProps();
      const resizeGroupState: IResizeGroupState = { dataToMeasure };
      const measuredElementWidthStub = sinon.stub();

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        measuredElementWidthStub,
        100);

      expect(result).to.deep.equal({
        renderedData: dataToMeasure,
        measureContainer: false,
        dataToMeasure: undefined,
      });
      expect(measuredElementWidthStub.callCount).to.equal(0);
    });

    it('calls onReduceData multiple times when everything is in the cache', () => {
      const dataArray = [{ cacheKey: '5' },
      { cacheKey: '4' },
      { cacheKey: '3' }];

      let measurementCache = getMeasurementCache();
      measurementCache.addMeasurementToCache(dataArray[0], 50);
      measurementCache.addMeasurementToCache(dataArray[1], 40);
      measurementCache.addMeasurementToCache(dataArray[2], 5);
      const getNextResizeGroupState = getNextResizeGroupStateProvider(measurementCache);

      const resizeGroupProps = getRequiredResizeGroupProps();
      resizeGroupProps.onReduceData.onFirstCall().returns(dataArray[1]);
      resizeGroupProps.onReduceData.onSecondCall().returns(dataArray[2]);

      const resizeGroupState: IResizeGroupState = { dataToMeasure: dataArray[0] };
      const measuredElementWidthStub = sinon.stub();

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        measuredElementWidthStub,
        10);

      expect(result).to.deep.equal({
        renderedData: dataArray[2],
        measureContainer: false,
        dataToMeasure: undefined,
      });
      expect(measuredElementWidthStub.callCount).to.equal(0);
    });

    it('sets dataToMeasure when the current data is in the cache but the onReduceData is not in the cache', () => {
      const dataArray = [{ cacheKey: '5' },
      { cacheKey: '4' }];

      let measurementCache = getMeasurementCache();
      measurementCache.addMeasurementToCache(dataArray[0], 50);
      const getNextResizeGroupState = getNextResizeGroupStateProvider(measurementCache);

      const resizeGroupProps = getRequiredResizeGroupProps();
      resizeGroupProps.onReduceData.onFirstCall().returns(dataArray[1]);

      const resizeGroupState: IResizeGroupState = { dataToMeasure: dataArray[0] };
      const measuredElementWidthStub = sinon.stub();

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        measuredElementWidthStub,
        10);

      expect(result).to.deep.equal({
        dataToMeasure: dataArray[1],
        measureContainer: false,
      });
      expect(measuredElementWidthStub.callCount).to.equal(0);
    });

    it('renders the last measured data if onReduceData returns undefined', () => {
      const dataToMeasure = { index: 5 };
      const resizeGroupProps = getRequiredResizeGroupProps();

      const resizeGroupState: IResizeGroupState = { dataToMeasure };
      resizeGroupProps.onReduceData.returns(undefined);

      const getNextResizeGroupState = getNextResizeGroupStateProvider();

      const getMeasuredElementWidthStub = sinon.stub();
      getMeasuredElementWidthStub.returns(25);

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        getMeasuredElementWidthStub,
        10);

      expect(result).to.deep.equal({
        dataToMeasure: undefined,
        renderedData: dataToMeasure,
        measureContainer: false
      });
      expect(getMeasuredElementWidthStub.callCount).to.equal(1);
    });

    it('renders the last measured data in the cache if onReduceData returns undefined', () => {
      const dataArray = [{ cacheKey: '5' },
      { cacheKey: '4' }];

      let measurementCache = getMeasurementCache();
      measurementCache.addMeasurementToCache(dataArray[0], 50);
      measurementCache.addMeasurementToCache(dataArray[1], 40);
      const getNextResizeGroupState = getNextResizeGroupStateProvider(measurementCache);

      const resizeGroupProps = getRequiredResizeGroupProps();
      resizeGroupProps.onReduceData.onFirstCall().returns(dataArray[1]);
      resizeGroupProps.onReduceData.onSecondCall().returns(undefined);

      const resizeGroupState: IResizeGroupState = { dataToMeasure: dataArray[0] };
      const measuredElementWidthStub = sinon.stub();

      let result = getNextResizeGroupState(resizeGroupProps,
        resizeGroupState,
        measuredElementWidthStub,
        10);

      expect(result).to.deep.equal({
        dataToMeasure: undefined,
        renderedData: dataArray[1],
        measureContainer: false
      });
      expect(measuredElementWidthStub.callCount).to.equal(0);
    });

    it('does not crash when the container size is set and there is no dataToMeasure', () => {
      const dataToMeasure = { foo: 'bar' };
      const resizeGroupProps = getRequiredResizeGroupProps();
      const resizeGroupState: IResizeGroupState = { dataToMeasure };
      const getNextResizeGroupState = getNextResizeGroupStateProvider();
      const getMeasuredElementWidthStub = sinon.stub();

      let result = getNextResizeGroupState(resizeGroupProps,
        {},
        getMeasuredElementWidthStub,
        50);

      expect(result).to.deep.equal({
        measureContainer: false,
      });
      expect(getMeasuredElementWidthStub.callCount).to.equal(0);
    });

    it('makes sure the contents still fit when the container width decreases', () => {
      const initialWidth = 50;
      const reducedWidth = 40;
      const renderedData = { foo: 'bar' };
      const resizeGroupProps = getRequiredResizeGroupProps();
      const resizeGroupState: IResizeGroupState = { renderedData };
      const getNextResizeGroupState = getNextResizeGroupStateProvider();
      const getMeasuredElementWidthStub = sinon.stub();

      // Set the initial window width
      getNextResizeGroupState(resizeGroupProps,
        {},
        undefined,
        initialWidth);

      // Pass in a state that reflects some rendered data
      let currentState = {
        renderedData: renderedData
      };

      let result = getNextResizeGroupState(resizeGroupProps,
        currentState,
        getMeasuredElementWidthStub,
        reducedWidth);

      // Important to note that we do not start scaling from the initial data,
      // we continue from the last rendered data.
      expect(result).to.deep.equal({
        renderedData: renderedData,
        dataToMeasure: renderedData,
        measureContainer: false
      });
      expect(getMeasuredElementWidthStub.callCount).to.equal(0);
    });

    it('starts from the beginning when the container width increases', () => {
      const initialWidth = 50;
      const increasedWidth = 60;
      const renderedData = { foo: 'bar' };
      const resizeGroupProps = { ...getRequiredResizeGroupProps(), data: { foo: 'initialData' } };
      const resizeGroupState: IResizeGroupState = { renderedData };
      const getNextResizeGroupState = getNextResizeGroupStateProvider();
      const getMeasuredElementWidthStub = sinon.stub();

      // Set the initial window width
      getNextResizeGroupState(resizeGroupProps,
        {},
        undefined,
        initialWidth);

      // Pass in a state that reflects some rendered data
      let currentState = {
        renderedData: renderedData
      };

      let result = getNextResizeGroupState(resizeGroupProps,
        currentState,
        getMeasuredElementWidthStub,
        increasedWidth);

      expect(result).to.deep.equal({
        renderedData: renderedData,
        dataToMeasure: resizeGroupProps.data,
        measureContainer: false
      });
      expect(getMeasuredElementWidthStub.callCount).to.equal(0);
    });
  });
});
