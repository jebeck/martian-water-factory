import { delay, takeEvery } from 'redux-saga';
import { call, put, race, select, take } from 'redux-saga/effects';

import api from './api';
import {
  actionTypes,
  intervals,
  hydrazineDrip,
  oxyhydrogenCombustion,
  staticElectricity,
  watchBurnWoodShavings,
  watchHydrazineValve,
  rootSaga,
} from './state';

describe('complex action creators (sagas)', () => {
  describe('hydrazineDrip', () => {
    it('should be a generator', () => {
      expect(typeof hydrazineDrip).toEqual('function');
      expect(hydrazineDrip.prototype.next).toBeDefined();
    });

    it('should do nothing if the valve is closed', () => {
      const saga = hydrazineDrip();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next().done).toBeTruthy();
    });

    it('should not do anything if the valve is toggled off or if an 💣 has already happened', () => {
      const saga = hydrazineDrip();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next(true).value).toEqual(race({
        stop: take([ actionTypes.TOGGLE_HYDRAZINE_VALVE, actionTypes.EXPLOSION ]),
        drip: call(delay, intervals.HYDRAZINE_DRIP),
      }));
      expect(saga.next({ stop: true }).done).toBeTruthy();
    });

    it('should drip hydrazine to produce H₂ on interval', () => {
      const saga = hydrazineDrip();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next(true).value).toEqual(race({
        stop: take([ actionTypes.TOGGLE_HYDRAZINE_VALVE, actionTypes.EXPLOSION ]),
        drip: call(delay, intervals.HYDRAZINE_DRIP),
      }));
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      const nextParallel = saga.next(true).value;
      expect(nextParallel[0].PUT.action.type).toEqual(actionTypes.HYDRAZINE_USED);
      expect(nextParallel[1].PUT.action.type).toEqual(actionTypes.HYDROGEN_PRODUCED);
    });

    it('drips hydrazine at a rate of 1 unit per 1.5 seconds, producing 2x H₂', () => {
      const saga = hydrazineDrip();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next(true).value.RACE).toBeDefined();
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      const nextParallel = saga.next(true).value;
      expect(nextParallel[0]).toEqual(put({
        type: actionTypes.HYDRAZINE_USED,
        payload: { amount: 1 },
      }));
      expect(nextParallel[1]).toEqual(put({
        type: actionTypes.HYDROGEN_PRODUCED,
        payload: { amount: 2 },
      }));
    });

    it('should bail if there\'s no hydrazine left', () => {
      const saga = hydrazineDrip();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next(true).value).toEqual(race({
        stop: take([ actionTypes.TOGGLE_HYDRAZINE_VALVE, actionTypes.EXPLOSION ]),
        drip: call(delay, intervals.HYDRAZINE_DRIP),
      }));
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      expect(saga.next(false).done).toBeTruthy();
    });
  });

  describe('oxyhydrogenCombustion', () => {
    it('should be a generator', () => {
      expect(typeof oxyhydrogenCombustion).toEqual('function');
      expect(oxyhydrogenCombustion.prototype.next).toBeDefined();
    });

    it('should not do anything if the 🔥 is already burning (#1)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({ fireAlreadyBurning: true }).done).toBeTruthy();
    });

    it('should not do anything if an 💣 has already happened (#2)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({ explosion: true }).done).toBeTruthy();
    });

    it('should not do anything if ignition fails (#3)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({ fireAlreadyBurning: false, explosion: false }).value)
        .toEqual(call(api.burnWoodShavings));
      expect(saga.next({ body: { ignited: false } }).done).toBeTruthy();
    });

    it('should bail if ignition succeeds but an 💣 takes place (#4)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({
        fireAlreadyBurning: false,
        explosion: false,
        readyToCombust: true
      }).value)
        .toEqual(call(api.burnWoodShavings));
      expect(saga.next({ body: { ignited: true } }).value).toEqual(race({
        stop: take(actionTypes.EXPLOSION),
        combust: call(delay, intervals.OXYHYDROGEN_COMBUSTION)
      }));
      expect(saga.next({ stop: true }).done).toBeTruthy();
    });

    it('should start producing 💧 via combustion (#5)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({
        fireAlreadyBurning: false,
        explosion: false,
        readyToCombust: true
      }).value)
        .toEqual(call(api.burnWoodShavings));
      expect(saga.next({ body: { ignited: true } }).value).toEqual(race({
        stop: take(actionTypes.EXPLOSION),
        combust: call(delay, intervals.OXYHYDROGEN_COMBUSTION)
      }));
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      expect(saga.next({ fireAlreadyBurning: false, readyToCombust: true }).value)
        .toEqual(put({ type: actionTypes.COMBUSTION_ACHIEVED }));
      const nextParallel = saga.next().value;
      expect(nextParallel[0].PUT.action.type).toEqual(actionTypes.HYDROGEN_USED);
      expect(nextParallel[1].PUT.action.type).toEqual(actionTypes.OXYGEN_USED);
      expect(nextParallel[2].PUT.action.type).toEqual(actionTypes.OXYGEN_STORED);
      expect(nextParallel[3].PUT.action.type).toEqual(actionTypes.WATER_PRODUCED);
    });

    it('consumes 2x more H₂ than O₂', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({
        fireAlreadyBurning: false,
        explosion: false,
        readyToCombust: true
      }).value)
        .toEqual(call(api.burnWoodShavings));
      expect(saga.next({ body: { ignited: true } }).value.RACE).toBeDefined();
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      const nextParallel = saga.next({ fireAlreadyBurning: true, readyToCombust: true }).value;
      const hydrogen = nextParallel[0].PUT.action.payload.amount;
      const oxygen = nextParallel[1].PUT.action.payload.amount - nextParallel[2].PUT.action.payload.amount;
      expect(hydrogen).toEqual(2 * oxygen);
    });

    it('should produce 💧 via combustion on interval if still readyToCombust (#6)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({
        fireAlreadyBurning: false,
        explosion: false,
        readyToCombust: true
      }).value)
        .toEqual(call(api.burnWoodShavings));
      expect(saga.next({ body: { ignited: true } }).value).toEqual(race({
        stop: take(actionTypes.EXPLOSION),
        combust: call(delay, intervals.OXYHYDROGEN_COMBUSTION)
      }));
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      const nextParallel = saga.next({ fireAlreadyBurning: true, readyToCombust: true }).value;
      expect(nextParallel[0].PUT.action.type).toEqual(actionTypes.HYDROGEN_USED);
      expect(nextParallel[1].PUT.action.type).toEqual(actionTypes.OXYGEN_USED);
      expect(nextParallel[2].PUT.action.type).toEqual(actionTypes.OXYGEN_STORED);
      expect(nextParallel[3].PUT.action.type).toEqual(actionTypes.WATER_PRODUCED);
    });

    it('should stop combusting & producing 💧 when no longer readyToCombust (#7)', () => {
      const saga = oxyhydrogenCombustion({ payload: { api } });
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next({
        fireAlreadyBurning: false,
        explosion: false,
        readyToCombust: true
      }).value)
        .toEqual(call(api.burnWoodShavings));
      expect(saga.next({ body: { ignited: true } }).value).toEqual(race({
        stop: take(actionTypes.EXPLOSION),
        combust: call(delay, intervals.OXYHYDROGEN_COMBUSTION)
      }));
      expect(saga.next({ stop: false }).value.SELECT).toBeDefined();
      expect(saga.next({ fireAlreadyBurning: true, readyToCombust: false }).value)
        .toEqual(put({ type: actionTypes.COMBUSTION_FAILED }));
      expect(saga.next().done).toBeTruthy();
    });
  });

  describe('staticElectricity', () => {
    it('should be a generator', () => {
      expect(typeof staticElectricity).toEqual('function');
      expect(staticElectricity.prototype.next).toBeDefined();
    });

    it('should produce a random 💥 on an interval', () => {
      const saga = staticElectricity();
      expect(saga.next().value)
        .toEqual(call(delay, intervals.STATIC_ELECTRICITY));
    });

    it('should cause an explosion and end if the 💥 occurs when H₂ is > 25', () => {
      const saga = staticElectricity();
      expect(saga.next().value.CALL).toBeDefined();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next(30).value)
        .toEqual(put({ type: actionTypes.EXPLOSION }));
      expect(saga.next().done).toBeTruthy();
    });

    it('should NOT cause an explosion if the 💥 occurs when H₂ is <= 25', () => {
      const saga = staticElectricity();
      expect(saga.next().value.CALL).toBeDefined();
      expect(saga.next().value.SELECT).toBeDefined();
      expect(saga.next(25).value).toEqual(call(delay, intervals.STATIC_ELECTRICITY));
    });
  });

  describe('watchBurnWoodShavings', () => {
    it('should be a generator', () => {
      expect(typeof watchBurnWoodShavings).toEqual('function');
      expect(watchBurnWoodShavings.prototype.next).toBeDefined();
    });

    it('should watch for every BURN_WOOD_SHAVINGS to call oxyhydrogenCombustion', () => {
      const watcher = watchBurnWoodShavings();
      expect(watcher.next().value).toEqual(call(
        takeEvery, actionTypes.BURN_WOOD_SHAVINGS, oxyhydrogenCombustion
      ));
    });
  });

  describe('watchHydrazineValve', () => {
    it('should be a generator', () => {
      expect(typeof watchHydrazineValve).toEqual('function');
      expect(watchHydrazineValve.prototype.next).toBeDefined();
    });

    it('should watch for every TOGGLE_HYDRAZINE_VALVE to call hydrazineDrip', () => {
      const watcher = watchHydrazineValve();
      // expect(watcher.next().value).toEqual(call(
      //   takeEvery, actionTypes.BURN_WOOD_SHAVINGS, hydrazineDrip
      // ));
      expect(watcher.next().value.CALL).toEqual({
        args: [
          actionTypes.TOGGLE_HYDRAZINE_VALVE,
          hydrazineDrip,
        ],
        context: null,
        fn: takeEvery
      });
    });
  });

  describe('rootSaga', () => {
    it('should be a generator', () => {
      expect(typeof rootSaga).toEqual('function');
      expect(rootSaga.prototype.next).toBeDefined();
    });

    it('should yield three generators in parallel', () => {
      const parallel = rootSaga().next().value;
      expect(parallel[0].next).toBeDefined();
      expect(parallel[1].next).toBeDefined();
      expect(parallel[2].next).toBeDefined();
    });
  });
});
