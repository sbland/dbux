/* eslint-disable no-nested-ternary */

/**
 * tryF is a functional wrapper for a try catch statement
 * @param {function} func // function to try
 */
 export const tryF = (func, errorCallback) => {
    try {
      return func();
    } catch (e) {
      return errorCallback ? errorCallback(e) : null;
    }
  };

  /**
   * ifF - Functional If Statement
   * @param {boolean} cond
   * @param {function} trueDo
   * @param {function} falseDo
   */
  export const ifF = (cond, trueDo, falseDo) => (cond ? trueDo() : falseDo());

  // ifF Example:

  // const isThereMilkInTheFridge = ('False' === 'True');
  // const drinkMilk = () => console.log('Drink Milk!');
  // const theShopIsOpen = ('true' !== 'false');
  // const closeFridgeDoor = () => console.log('Door Closed');
  // const goToShop = () => console.log('Its False!');
  // const drinkWater = () => console.log('Drink Water!');

  // ifF(isThereMilkInTheFridge, drinkMilk, closeFridgeDoor()
  //   && ifF(theShopIsOpen, goToShop(),
  //     drinkWater()));

  // Example using ternary operation
  // const callbackb = (isThereMilkInTheFridge)
  //   ? drinkMilk() && closeFridgeDoor()
  //   : closeFridgeDoor() && (theShopIsOpen)
  //     ? goToShop()
  //     : drinkWater();

  // callbackb();

  /**
   *
   * @param {string} c // called case
   * @param {object} obj // Cases
   * @param {function} default // default
   */
  export const switchF = (c, options, def) => {
    const activeCaseList = Object.keys(options)
      .filter((key) => {
        if (Array.isArray(key)) {
          return key.indexOf(c) >= 0;
        }
        if (typeof key === 'function') {
          return key(c);
        }
        return key === c;
      })
      .map((key) => options[key]);
    if (activeCaseList.length === 0 && def) return def();
    const activeCase = activeCaseList[0];
    if (typeof activeCase === 'function') return activeCase();
    if (typeof activeCase === 'string' && options[activeCase]) return options[activeCase]();
    throw Error('switch F Failed!');
  };

  /**
   * Alternate switch that allows lambda patterns as keys
   *
   * @param {any} c
   * @param {Array[Array[
   * pattern,
   * value {function | strpattern}
   * ]]} options
   * @param {function} def
   * @returns
   */
  export const switchFLam = (c, options, def) => {
    const choice = options.find(([key]) => {
      if (Array.isArray(key)) {
        return key.indexOf(c) >= 0;
      }
      if (typeof key === 'function') {
        return key(c);
      }
      return key === c;
    });
    if (!choice) return def();
    const [, choiceVal] = choice;
    if (typeof choiceVal === 'function') return choiceVal();
    if (typeof choiceVal === 'string') {
      return switchFLam(choiceVal, options, def);
    }
    throw Error('switch F Failed!');
  };

  // FASTER VERSION \/\/
  // function toPartitions ( size ) {
  //   var partition = [];
  //   return function ( acc, v ) {
  //       partition.push( v );
  //       if ( partition.length === size ) {
  //           acc.push( partition );
  //           partition = [];
  //       }
  //       return acc;
  //   };
  // }

  // a.reduce( toPartitions( 3 ), [] );
