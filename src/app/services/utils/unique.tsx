/**
 * @file utils/unique.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Generates a unique number starting from 1
 * @export {Unique}
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-22
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */
class Unique {
  /**
   * Creates an instance of Unique. Initializes value with zero
   * @memberof Unique
   */
  private constructor() {
    this.value = 0;
  }

  /**
   * @property value
   * @desc The previous unique value
   * @private
   * @type {number}
   * @memberof Unique
   */
  private value: number;
  /**
   * @property instance
   * @desc An instance of the class. To the class singletone
   * @private
   * @static
   * @type {Unique}
   * @memberof Unique
   */
  private static instance: Unique;

  /**
   * @function getInstance
   * @desc Creates or returns the instance of the class.
   * @static
   * @returns {Unique}
   * @memberof Unique
   */
  public static getInstance() {
    if (!Unique.instance) {
      Unique.instance = new Unique();
    }

    return Unique.instance;
  }

  /**
   * @function get
   * @desc Generates a new unique number
   * @returns {number}
   * @memberof Unique
   */
  public get() {
    this.value += 1;

    return this.value;
  }
}

export default Unique.getInstance();
