import { readyToCombust, totalOxygen } from './utils';

describe('totalOxygen', () => {
  it('should be a function', () => {
    expect(totalOxygen).toBeDefined();
    expect(typeof totalOxygen).toBe('function');
  });

  it('should return 0 if given no params', () => {
    expect(totalOxygen()).toBe(0);
  });

  it('should return the value of a single param', () => {
    expect(totalOxygen(1)).toBe(1);
  });

  it('should return the sum of all params', () => {
    expect(totalOxygen(1,3,5,8)).toBe(17);
  });
});

describe('readyToCombust', () => {
  it('should be a function', () => {
    expect(readyToCombust).toBeDefined();
    expect(typeof readyToCombust).toBe('function');
  });

  it('should error if given no params', () => {
    expect(readyToCombust()).toThrow();
  });

  it('should return false if hydrogen is <= 1', () => {
    const enoughOxygen = 100;
    expect(readyToCombust(0, enoughOxygen)).toBeFalsy();
    expect(readyToCombust(1, enoughOxygen)).toBeFalsy();
  });

  it('should return false if total oxygen is <= 25', () => {
    const enoughHydrogen = 5;
    expect(readyToCombust(enoughHydrogen, 25)).toBeFalsy();
    expect(readyToCombust(enoughHydrogen, 10)).toBeFalsy();
  });

  it('should return true if hydrogen is > 1 and total oxygen is > 25', () => {
    expect(readyToCombust(2, 26)).toBeTruthy();
  });
});
