import * as moment from 'moment';

class TimeUntiles {

  public full(timestamp: number) {
    return moment(timestamp).format('dddd, MMMM DD YYYY, HH:mm');
  }

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
