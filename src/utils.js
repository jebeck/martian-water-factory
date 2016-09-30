/**
 * totalOxygen
 *
 * @param {...Number} liters of oxygen in a storage tank
 *
 * @return {Number} sum total of stored oxygen
 */
export function totalOxygen(...tanks) {
  return tanks.reduce((pre, val) => {
    return pre + val;
  }, 0);
}

/**
 * readyToCombust
 *
 * @param {Number} liters of hydrogen
 * @param {Number} liters of stored oxygen
 *
 * @return {Boolean} is ready to combust?
 */
export function readyToCombust(totalHydrogen, totalOxygen) {
  return totalHydrogen > 1 && totalOxygen > 25;
}
