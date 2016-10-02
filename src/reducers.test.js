import {
  actionTypes,
  explosion,
  fireBurning,
  hydrazine,
  hydrazineValveOpen,
  hydrogen,
  oxygen,
  water,
} from './state';

describe('explosion', () => {
  it('should return `false` for initial state', () => {
    expect(explosion(undefined, {})).toEqual(false);
  });

  it('should handle EXPLOSION', () => {
    expect(explosion(undefined, { type: actionTypes.EXPLOSION })).toEqual(true);
  });
});

describe('fireBurning', () => {
  it('should return `false` for initial state', () => {
    expect(fireBurning(undefined, {})).toEqual(false);
  });

  it('should return `true` on COMBUSTION_ACHIEVED', () => {
    expect(fireBurning(undefined, { type: actionTypes.COMBUSTION_ACHIEVED })).toEqual(true);
  });

  it('should return `false` on COMBUSTION_FAILED', () => {
    expect(fireBurning(true, { type: actionTypes.COMBUSTION_FAILED })).toEqual(false);
  });

  it('should return `false` on EXPLOSION', () => {
    expect(fireBurning(true, { type: actionTypes.EXPLOSION })).toEqual(false);
  });
});

describe('hydrazine', () => {
  it('should return `300` for initial state', () => {
    expect(hydrazine(undefined, {})).toEqual(300);
  });

  it('should decrease state by `amount` on HYDRAZINE_USED', () => {
    const start = 5;
    const amount = 3;
    expect(hydrazine(start, {
      type: actionTypes.HYDRAZINE_USED,
      payload: { amount },
    })).toEqual(start - amount);
  });
});

describe('hydrazineValveOpen', () => {
  it('should return `false` for initial state', () => {
    expect(hydrazineValveOpen(undefined, {})).toEqual(false);
  });

  it('should flip state on TOGGLE_HYDRAZINE_VALVE', () => {
    expect(hydrazineValveOpen(true, { type: actionTypes.TOGGLE_HYDRAZINE_VALVE })).toEqual(false);
    expect(hydrazineValveOpen(false, { type: actionTypes.TOGGLE_HYDRAZINE_VALVE })).toEqual(true);
  });
});

describe('hydrogen', () => {
  it('should return `0` for initial state', () => {
    expect(hydrogen(undefined, {})).toEqual(0);
  });

  it('should increase state by `amount` on HYDROGEN_PRODUCED', () => {
    const start = 1;
    const amount = 4;
    expect(hydrogen(start, {
      type: actionTypes.HYDROGEN_PRODUCED,
      payload: { amount },
    })).toEqual(start + amount);
  });

  it('should decrease state by `amount` on HYDROGEN_PRODUCED', () => {
    const start = 4;
    const amount = 1;
    expect(hydrogen(start, {
      type: actionTypes.HYDROGEN_USED,
      payload: { amount },
    })).toEqual(start - amount);
  });
});

describe('oxygen', () => {
  it('should return `{ tank1: 144, tank2: 179 }` for initial state', () => {
    expect(oxygen(undefined, {})).toEqual({
      tank1: 144,
      tank2: 179,
    });
  });

  it('should top up tank2 on OXYGEN_STORED', () => {
    const start = 5;
    const initialState = {
      tank1: start,
      tank2: start,
    };
    const amount = 1;
    const result = oxygen(initialState, {
      type: actionTypes.OXYGEN_STORED,
      payload: { amount },
    });
    expect(result).toEqual({
      tank1: start,
      tank2: start + amount,
    });
    // test to be sure not mutating state object!
    // but rather returning new...
    expect(result).not.toBe(initialState);
  });

  it('should pull O₂ from tank1 if available on OXYGEN_USED', () => {
    const start = 5;
    const initialState = {
      tank1: start,
      tank2: start,
    };
    const amount = 1;
    const result = oxygen(initialState, {
      type: actionTypes.OXYGEN_USED,
      payload: { amount },
    });
    expect(result).toEqual({
      tank1: start - amount,
      tank2: start,
    });
    // test to be sure not mutating state object!
    // but rather returning new...
    expect(result).not.toBe(initialState);
  });

  it('should NOT pull O₂ from tank1 (but rather from tank2) if not available on OXYGEN_USED', () => {
    const start = 5;
    const initialState = {
      tank1: start,
      tank2: start * 20,
    };
    const amount = 10;
    const result = oxygen(initialState, {
      type: actionTypes.OXYGEN_USED,
      payload: { amount },
    });
    expect(result).toEqual({
      tank1: start,
      tank2: start * 20 - amount,
    });
    // test to be sure not mutating state object!
    // but rather returning new...
    expect(result).not.toBe(initialState);
  });
});

describe('water', () => {
  it('should return `0` for initial state', () => {
    expect(water(undefined, {})).toEqual(0);
  });

  it('should increase state by `amount` on WATER_PRODUCED', () => {
    const start = 2;
    const amount = 5;
    expect(water(start, {
      type: actionTypes.WATER_PRODUCED,
      payload: { amount },
    })).toEqual(start + amount);
  });
});
