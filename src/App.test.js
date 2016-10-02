import React from 'react';

import { shallow } from 'enzyme';

import { App } from './App';

describe('a Martian Water Factory', () => {
  const burnWoodShavingsSpy = jest.fn();
  const toggleHydrazineValveSpy = jest.fn();
  const props = {
    api: {
      burnWoodShavings: jest.fn(),
    },
    burnWoodShavings: burnWoodShavingsSpy,
    explosion: false,
    fireBurning: false,
    hydrazine: 10,
    hydrazineValveOpen: false,
    hydrogen: 0,
    oxygen: {
      tank1: 5,
      tank2: 5,
    },
    toggleHydrazineValve: toggleHydrazineValveSpy,
    water: 0,
  };

  let wrapper;
  beforeEach(() => {
    wrapper = shallow(<App {...props} />);
  });

  describe('burnWoodShavings button', () => {
    it('should call this.props.burnWoodShavings when clicked', () => {
      expect(burnWoodShavingsSpy).not.toBeCalled();
      wrapper.find('.Chimney').find('button').simulate('click');
      expect(burnWoodShavingsSpy).toBeCalled();
    })
  });

  describe('toggleHydrazineValve button', () => {
    it('should read "Open Valve" if this.props.hydrazineValveOpen is false', () => {
      expect(wrapper.find('.Hydrazine').find('button').text()).toEqual('Open Valve');
    });

    it('should read "Close Valve" if this.props.hydrazineValveOpen is true', () => {
      wrapper.setProps({ hydrazineValveOpen: true });
      expect(wrapper.find('.Hydrazine').find('button').text()).toEqual('Close Valve');
    });

    it('should call this.props.toggleHydrazineValve when clicked', () => {
      expect(toggleHydrazineValveSpy).not.toBeCalled();
      wrapper.find('.Hydrazine').find('button').simulate('click');
      expect(toggleHydrazineValveSpy).toBeCalled();
    });
  });
});
