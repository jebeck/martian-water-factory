import React from 'react';

import { mount } from 'enzyme';

import App from './App';

describe('a Martian Water Factory', () => {
  let wrapper;

  describe('⚜ synchronous stuff', () => {
    beforeEach(() => {
      wrapper = mount(<App api={{ burnWoodShavings: () => {} }} />);
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
  });

  describe('♻️ asynchronous stuff', () => {
    describe('burning wood shavings', () => {
      describe('successful ignition', () => {
        const api = {
          burnWoodShavings: (cb) => { cb(undefined, { body: { ignited: true } }); },
        };

        beforeEach(() => {
          wrapper = mount(<App api={api} />);
        });

        it('lights H₂ & O₂ on 🔥 to produce 💧', () => {
          wrapper.find('.Chimney').find('button').simulate('click');
          expect(wrapper.state('fireBurning')).toBeTruthy();
        });
      });

      describe('failed ignition', () => {
        const api = {
          burnWoodShavings: (cb) => { cb('Ignition failed :('); },
        };

        beforeEach(() => {
          wrapper = mount(<App api={api} />);
        });

        it('does *not* light H₂ & O₂ on 🔥 to produce 💧', () => {
          wrapper.find('.Chimney').find('button').simulate('click');
          expect(wrapper.state('fireBurning')).toBeFalsy();
        });
      });
    });
  });
});
