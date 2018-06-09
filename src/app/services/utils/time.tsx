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
  public fullOnlyDate(timestamp: number) {
    return moment(timestamp).format('dddd, MM/DD/YYYY');
  }

  public Date(timestamp: number) {
    return moment(timestamp).format('YYYY-MM-DD');
  }

  public DateParse(timestamp: number) {
    return moment(timestamp).format('MM/DD/YYYY');
  }

  public DateGet(date: string): number {
    return parseInt(moment(date, 'YYYY-MM-DD').format('x'), 10);
  }

  public DateUpdateTime(date: number, time: string): number {
    const timeSplit = time.split(':');
    return parseInt(moment(date).startOf('day')
      .add(timeSplit[0], 'hours').add(timeSplit[1], 'minutes').format('x'), 10);
  }

  public getDateTime(timestamp: number) {
    return moment(timestamp).format('HH/mm');
  }

  public addDateTime(time: string, date: any) {
    const timeSplit = time.split('/');
    return moment(date).add(timeSplit[0], 'hours').add(timeSplit[1], 'minutes').format('x');
  }

  public Time(timestamp: number) {
    return moment(timestamp).format('HH:mm');
  }

  public TimeParse(timestamp: number) {
    return moment(timestamp).format('hh:mm a');
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

  /**
   * @func dynamic
   * @desc Formates the given timestamp dynamically.
   * @param {number} timestamp
   * @returns {string} Time related to now
   * @memberof TimeUntiles
   */
  public dynamicTask(timestamp: number, haveTime: boolean) {
    let date;
    if (!haveTime) {
      date = moment(timestamp).startOf('day').add(23, 'hours').add(59, 'minutes');
    } else {
      date = moment(timestamp);
    }
    const current = Date.now();
    let diffDate = date.diff(moment(current));
    let str = ' left';

    if (diffDate < 0) {
      diffDate = diffDate * -1;
      str = ' ago';
    }

    const diffDateDay = Math.floor(diffDate / (1000 * 60 * 60 * 24));
    const diffDateHour = Math.floor(diffDate / (1000 * 60 * 60));
    const diffDateMin = Math.floor(diffDate / (1000 * 60));

    if (diffDateDay > 1 || diffDateDay === 1 && haveTime) {
      return diffDateDay + ' ' + (diffDateDay > 1 ? 'days' : 'day') + str;
    } else if (diffDateHour > 0) {
      const tonight = moment(current).startOf('day').add(1, 'days');
      const lastNight = moment(current).startOf('day');
      if (date.isSameOrBefore(lastNight)) {
        return date.format(haveTime ? '[Yesterday at] HH:mm' : '[Yesterday]');
      } else if (date.isSameOrBefore(tonight)) {
        return date.format(haveTime ? '[Today at] HH:mm' : '[Today]');
      } else {
        return date.format(haveTime ? '[Tomorrow at] HH:mm' : '[Tomorrow]');
      }
    } else if (diffDateMin > 0) {
      return diffDateMin + ' ' + (diffDateMin > 1 ? 'minutes' : 'minute') + str;
    } else {
      // return 'Less than a minute';
    }
    return date.format('DD[/]MM[/]YYYY');
  }

}

export default new TimeUntiles();
