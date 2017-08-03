/**
 * @file utils/array.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Tools for working with arrays
 * @export {ArrayUntiles}
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-31
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */

/**
 * @class ArrayUntiles
 * @desc Tools for working with arrays
 */
class ArrayUntiles {
  /**
   * Returns an array that duplicate objects has been removed.
   * The given key is used to determine the objects with the same values
   * @param {any[]} array
   * @param {string} key
   * @returns {any[]}
   * @memberof ArrayUntiles
   */
  public uniqueObjects(array: any[], key: string): any[] {

    let obj = new Object();
    obj = {};

    const len = array.length;
    for (let i = 0; i < len; i++) {
      obj[array[i][key]] = array[i];
    }

    let newArray: any[];
    newArray = [];

    Object.keys(obj).forEach((element) => {
      newArray.push(obj[element]);
    });

    return newArray;

  }

  /**
   * @func uniqueArray
   * @desc Creates a new array form the given one without duplicate values
   * @param {(string[] | number[])} array
   * @returns {any[]}
   * @memberof ArrayUntiles
   */
  public uniqueArray(array: string[] | number[]): any[] {
    let obj = new Object();
    obj = {};

    for (const value of array) {
      obj[value] = value;
    }

    return Object.keys(obj);
  }
}

export default new ArrayUntiles();
