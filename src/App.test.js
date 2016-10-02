import React from 'react';

import { mount } from 'enzyme';

import App from './App';

jest.useFakeTimers();

describe('a Martian Water Factory', () => {
  let wrapper;
  beforeEach(() => {
    const intervals = {
      dihydrogenMonoxideViaCombustion: 12.5,
      hydrazineDrip: 15,
      staticElectricity: 50,
    };
    wrapper = mount(<App intervals={intervals} />);
  });

  describe('hydrazine valve', () => {
    it('starts closed', () => {
      expect(wrapper.state('hydrazineValveOpen')).toBeFalsy();
    });

    it('toggles open when button is clicked', () => {
      wrapper.find('.Hydrazine').find('button').simulate('click');
      expect(wrapper.state('hydrazineValveOpen')).toBeTruthy();
    });

    it('drips hydrazine at a rate of 1 unit per 1.5 seconds, producing 2x H₂', () => {
      wrapper.find('.Hydrazine').find('button').simulate('click');
      expect(setInterval.mock.calls[setInterval.mock.calls.length - 1][1])
        .toBe(wrapper.prop('intervals').hydrazineDrip);

      jest.runOnlyPendingTimers();

      expect(wrapper.state('hydrogen')).toBeGreaterThanOrEqual(2);
    });
  });

  describe('burning wood shavings', () => {
    it('has no effect if no H₂ is available to 🔥', () => {
      expect(wrapper.state('hydrogen')).toEqual(0);
      wrapper.find('.Chimney').find('button').simulate('click');
      expect(wrapper.state('fireBurning')).toBeFalsy();
    });

    it('lights H₂ & O₂ on 🔥 to produce 💧', () => {
      wrapper.setState({hydrogen: 5});
      wrapper.find('.Chimney').find('button').simulate('click');
      expect(wrapper.state('fireBurning')).toBeTruthy();
    });

    it('consumes 2x more H₂ than O₂ through combustion', () => {
      const startingHydrogen = 4;
      wrapper.setState({hydrogen: startingHydrogen});
      wrapper.find('.Chimney').find('button').simulate('click');
      const instance = wrapper.instance();
      const startingOxygen = instance.totalOxygen();

      jest.runOnlyPendingTimers();

      expect(startingHydrogen - wrapper.state('hydrogen')).toBeCloseTo(0.8);

      expect(startingHydrogen - wrapper.state('hydrogen'))
        .toBeCloseTo(2 * (startingOxygen - instance.totalOxygen()));
    });

    it('stops burning when out of H₂', () => {
      wrapper.setState({hydrogen: 5});
      wrapper.find('.Chimney').find('button').simulate('click');
      expect(wrapper.state('fireBurning')).toBeTruthy();

      jest.runOnlyPendingTimers();
      // jest.runAllTimers();
      // jest.runTimersToTime(10 * intervals.dihydrogenMonoxideViaCombustion);

      expect(wrapper.state('hydrogen')).toEqual(0);
      expect(wrapper.state('fireBurning')).toBeFalsy();
    });
  });
});
