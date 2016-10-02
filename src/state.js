import update from 'react-addons-update';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import createLogger from 'redux-logger';
import createSagaMiddleware, { delay, takeEvery } from 'redux-saga';
import { call, put, race, select, take } from 'redux-saga/effects';

import * as utils from './utils';

export const intervals = {
  STATIC_ELECTRICITY: 500,
  HYDRAZINE_DRIP: 150,
  OXYHYDROGEN_COMBUSTION: 125,
};

export function configureStore(initialState) {
  const sagaMiddleware = createSagaMiddleware();

  const reducers = combineReducers({
    explosion,
    fireBurning,
    hydrazine,
    hydrazineValveOpen,
    hydrogen,
    oxygen,
    water,
  });

  const store = createStore(reducers, initialState, applyMiddleware(
    sagaMiddleware,
    createLogger({ collapsed: true }),
  ));

  sagaMiddleware.run(rootSaga);

  return store;
}

export const actionTypes = {
  BURN_WOOD_SHAVINGS: 'BURN_WOOD_SHAVINGS',
  COMBUSTION_ACHIEVED: 'COMBUSTION_ACHIEVED',
  COMBUSTION_FAILED: 'COMBUSTION_FAILED',
  EXPLOSION: 'EXPLOSION',
  HYDRAZINE_USED: 'HYDRAZINE_USED',
  HYDROGEN_PRODUCED: 'HYDROGEN_PRODUCED',
  HYDROGEN_USED: 'HYDROGEN_USED',
  OXYGEN_STORED: 'OXYGEN_STORED',
  OXYGEN_USED: 'OXYGEN_USED',
  TOGGLE_HYDRAZINE_VALVE: 'TOGGLE_HYDRAZINE_VALVE',
  WATER_PRODUCED: 'WATER_PRODUCED',
};

/*
 * SIMPLE (SYNCHRONOUS) ACTION CREATORS
 */
export function burnWoodShavings(api) {
  return {
    type: actionTypes.BURN_WOOD_SHAVINGS,
    payload: { api },
  };
}

export function toggleHydrazineValve() {
  return {
    type: actionTypes.TOGGLE_HYDRAZINE_VALVE,
  };
}

/*
 * REDUCERS
 */
export function explosion(state = false, action) {
  switch (action.type) {
    case actionTypes.EXPLOSION:
      return true;
    default:
      return state;
  }
}

export function fireBurning(state = false, action) {
  switch (action.type) {
    case actionTypes.COMBUSTION_ACHIEVED:
      return true;
    case actionTypes.COMBUSTION_FAILED:
      return false;
    case actionTypes.EXPLOSION:
      return false;
    default:
      return state;
  }
}

export function hydrazine(state = 300, action) {
  switch (action.type) {
    case actionTypes.HYDRAZINE_USED:
      const { amount } = action.payload;
      return state - amount;
    default:
      return state;
  }
}

export function hydrazineValveOpen(state = false, action) {
  switch (action.type) {
    case actionTypes.TOGGLE_HYDRAZINE_VALVE:
      return !state;
    default:
      return state;
  }
}

export function hydrogen(state = 0, action) {
  switch(action.type) {
    case actionTypes.HYDROGEN_PRODUCED: {
      const { amount } = action.payload;
      return state + amount;
    }
    case actionTypes.HYDROGEN_USED: {
      const { amount } = action.payload;
      return state - amount;
    }
    default:
      return state;
  }
}

export function oxygen(state = { tank1: 144, tank2: 179 }, action) {
  switch(action.type) {
    case actionTypes.OXYGEN_STORED: {
      const { amount } = action.payload;
      return update(
        state,
        { tank2: { $apply: (level) => { return level + amount; } } }
      );
    }
    case actionTypes.OXYGEN_USED: {
      const { amount } = action.payload;
      const { tank1 } = state;
      if ((tank1 - amount) >= 0) {
        return update(
          state,
          { tank1: { $apply: (level) => { return level - amount; } } }
        );
      }
      return update(
        state,
        { tank2: { $apply: (level) => { return level - amount; } } }
      );
    }
    default:
      return state;
  }
}

export function water(state = 0, action) {
  switch(action.type) {
    case actionTypes.WATER_PRODUCED:
      const { amount } = action.payload;
      return state + amount;
    default:
      return state;
  }
}

/*
 * COMPLEX ACTION CREATORS (sagas)
 * GREAT blog post for an introduction to redux-saga:
 * http://jaysoo.ca/2016/01/03/managing-processes-in-redux-using-sagas/
 */

export function* hydrazineDrip() {
  const hydrazineValveOpen = yield select((state) => (state.hydrazineValveOpen));
  if (hydrazineValveOpen) {
    while (true) {
      const { stop } = yield race({
        stop: take([ actionTypes.TOGGLE_HYDRAZINE_VALVE, actionTypes.EXPLOSION ]),
        drip: call(delay, intervals.HYDRAZINE_DRIP),
      });
      if (!stop) {
        const { hydrazineLeft, hydrogenAtSafeLevel } = yield select((state) => {
          return {
            hydrazineLeft: state.hydrazine >= 1,
            hydrogenAtSafeLevel: state.hydrogen < 23,
          };
        });
        if (hydrazineLeft && hydrogenAtSafeLevel) {
          yield [
            put({
              type: actionTypes.HYDRAZINE_USED,
              payload: { amount: 1 },
            }),
            put({
              type: actionTypes.HYDROGEN_PRODUCED,
              payload: { amount: 2 },
            }),
          ];
        } else {
          yield put({ type: actionTypes.TOGGLE_HYDRAZINE_VALVE });
          break;
        }
      } else {
        break;
      }
    }
  }
}

export function* oxyhydrogenCombustion(action) {
  const { api } = action.payload;
  const { explosion, fireAlreadyBurning, readyToCombust } = yield select((state) => {
    const { tank1, tank2 } = state.oxygen;
    return {
      explosion: state.explosion,
      fireAlreadyBurning: state.fireBurning,
      readyToCombust: utils.readyToCombust(
        state.hydrogen, utils.totalOxygen(tank1, tank2)
      ),
    };
  });
  // tests #1 & #2
  if (!fireAlreadyBurning && !explosion) {
    try {
      // test #3
      const { body: ignited } = yield call(api.burnWoodShavings);
      if (ignited && readyToCombust) {
        while (true) {
          const { stop } = yield race({
            // test #4
            stop: take(actionTypes.EXPLOSION),
            combust: call(delay, intervals.OXYHYDROGEN_COMBUSTION),
          });
          if (!stop) {
            const { fireAlreadyBurning, readyToCombust } = yield select((state) => {
              const { tank1, tank2 } = state.oxygen;
              return {
                fireAlreadyBurning: state.fireBurning,
                readyToCombust: utils.readyToCombust(
                  state.hydrogen, utils.totalOxygen(tank1, tank2)
                ),
              };
            });
            if (readyToCombust) {
              // test #5
              if (!fireAlreadyBurning) {
                yield put({ type: actionTypes.COMBUSTION_ACHIEVED });
              }
              // test #6
              yield [
                put({
                  type: actionTypes.HYDROGEN_USED,
                  payload: { amount: 0.8 },
                }),
                put({
                  type: actionTypes.OXYGEN_USED,
                  payload: { amount: 0.5 },
                }),
                put({
                  type: actionTypes.OXYGEN_STORED,
                  payload: { amount: 0.1 },
                }),
                put({
                  type: actionTypes.WATER_PRODUCED,
                  payload: { amount: 0.8 },
                }),
              ];
            } else {
              // test #7
              yield put({ type: actionTypes.COMBUSTION_FAILED });
              break;
            }
          } else {
            break;
          }
        }
      }
    } catch (err) {
      console.warn(err);
    }
  }
}

export function* staticElectricity() {
  while (true) {
    yield call(delay, intervals.STATIC_ELECTRICITY);
    const hydrogen = yield select((state) => { return state.hydrogen; });
    if (hydrogen > 25) {
      yield put({ type: actionTypes.EXPLOSION });
      break;
    }
  }
}

export function* watchBurnWoodShavings() {
  yield call(takeEvery, actionTypes.BURN_WOOD_SHAVINGS, oxyhydrogenCombustion);
}

export function* watchHydrazineValve() {
  yield call(takeEvery, actionTypes.TOGGLE_HYDRAZINE_VALVE, hydrazineDrip);
}

export function* rootSaga() {
  yield [
    staticElectricity(),
    watchBurnWoodShavings(),
    watchHydrazineValve(),
  ];
}
