import { isFSA } from 'flux-standard-action';

import {
  actionTypes,
  burnWoodShavings,
  toggleHydrazineValve,
} from './state';

describe('simple (sync) action creators', () => {
  describe('burnWoodShavings', () => {
    it('should be a function', () => {
      expect(typeof burnWoodShavings).toEqual('function');
    });

    it('should create an FSA', () => {
      expect(isFSA(burnWoodShavings())).toBeTruthy();
    });

    it('should have a `type` of BURN_WOOD_SHAVINGS', () => {
      expect(burnWoodShavings().type).toEqual(actionTypes.BURN_WOOD_SHAVINGS);
    });

    it('should have `api` in its payload', () => {
      const api = {};
      expect(burnWoodShavings(api).payload).toEqual({ api });
    });
  });

  describe('toggleHydrazineValve', () => {
    it('should be a function', () => {
      expect(typeof toggleHydrazineValve).toEqual('function');
    });

    it('should create an FSA', () => {
      expect(isFSA(toggleHydrazineValve())).toBeTruthy();
    });

    it('should have only a `type` of TOGGLE_HYDRAZINE_VALVE', () => {
      expect(toggleHydrazineValve()).toEqual({
        type: actionTypes.TOGGLE_HYDRAZINE_VALVE
      });
    });
  });
});
