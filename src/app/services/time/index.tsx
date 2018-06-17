/**
 * @file services/time.tsx
 * @author Hamidreza KK <hamidrezakks@gmail.com>
 * @description Nested Time
 * The name is too big for a service that manages the authenticated user data
 * Documented by:          Hamidreza KK
 * Date of documentation:  2017-07-25
 * Reviewed by:
 * Date of review:
 */

/**
 * @class Time
 * @desc A signletone class that stores the authenticated user data
 * @export
 */
export default class Time {
  /**
   * @prop instance
   * @desc An instance of Time.
   * @private
   * @static
   * @type {Time}
   * @memberof Time
   */
  private static instance: Time;
  private serverTime: any;
  private timeDiff: number;

  /**
   * @func getInstance
   * @desc The class constructor is private. This method creates an instance of Time once
   * and returns the instance everytime you call it
   * @static
   * @returns
   * @memberof Time
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new Time();
    }

    return this.instance;
  }

  /**
   * @constructor
   * @desc Creates an instance of Time.
   * @memberof Time
   */
  private constructor() {
    this.timeDiff = 0;
    this.serverTime = Date.now();
  }

  public setServerTime(timestamp: number) {
    this.serverTime = timestamp;
    this.timeDiff = this.serverTime - Date.now();
  }

  public now(timestamp?: any) {
    if (timestamp) {
      return timestamp + this.timeDiff;
    } else {
      return Date.now() + this.timeDiff;
    }
  }
}
