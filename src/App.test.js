import React from 'react';

import { mount } from 'enzyme';

import App from './App';

describe('a Martian Water Factory', () => {
  let wrapper;
  beforeEach(() => {
    wrapper = mount(<App />);
  });

  describe('hydrazine valve', () => {
    it('starts closed', () => {
      expect(wrapper.state('hydrazineValveOpen')).toBeFalsy();
    });

    it('toggles open when button is clicked', () => {
      wrapper.find('.Hydrazine').find('button').simulate('click');
      expect(wrapper.state('hydrazineValveOpen')).toBeTruthy();
    });
  });

  describe('burning wood shavings', () => {
    it('lights H₂ & O₂ on 🔥 to produce 💧', () => {
      wrapper.find('.Chimney').find('button').simulate('click');
      expect(wrapper.state('fireBurning')).toBeTruthy();
    });
  });
});
