/**
 * @file utils/time.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Tools for formatting a timestamp
 * @export {TimeUntiles}
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-31
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */
import * as moment from 'moment';

/**
 * @class TimeUntiles
 * @desc Formats a timestamp (usually provided by Cyrus) in full and dynamic formats
 */
class TimeUntiles {

  /**
   * @func full
   * @desc Formats the given timestamp in full mode
   * @param {number} timestamp
   * @returns {string}
   * @memberof TimeUntiles
   */
  public full(timestamp: number) {
    return moment(timestamp).format('dddd, MMMM DD YYYY, HH:mm');
  }

  /**
   * @func dynamic
   * @desc Formates the given timestamp dynamically.
   * @param {number} timestamp
   * @returns {string} Time related to now
   * @memberof TimeUntiles
   */
  public dynamic(timestamp: number) {

    const date = moment(timestamp);
    const current = Date.now();

    const justNow = moment().startOf('minute');
    if (date.isSameOrAfter(justNow)) {
      return 'Just Now';
    }

    const today = moment(current).startOf('day');
    if (date.isSameOrAfter(today)) {
      return date.format('HH:mm');
    }

    const yesterday = moment(current).startOf('day').subtract(1, 'days');
    if (date.isSameOrAfter(yesterday)) {
      return date.format('[Yesterday] HH:mm');
    }

    const thisYear = moment(current).startOf('year');
    if (date.isSameOrAfter(thisYear)) {
      return date.format('MMM DD');
    }

    return date.format('DD[/]MM[/]YYYY');

  }

}

export default new TimeUntiles();
