/**
 * Determines client device properties
 * @export
 * @class Client
 */
export default class Client {
  private constructor() {

  }

  /**
   * adopt the browser name and version from `navigator.platform`
   * @static
   * @returns {string} client browser
   * @memberof Client
   * @function
   */
  public static getBrowser() {
    return navigator.platform.split(' ')[0];
  }

  /**
   * adopt os properties from navigator object of window
   * @static
   * @returns {string} Client OS
   * @memberof Client
   * @function
   */
  public static getOS() {
    const ua = navigator.userAgent;
    let tem;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    if (/trident/i.test(M[1])) {
      tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
      return 'IE ' + (tem[1] || '');
    }
    if (M[1] === 'Chrome') {
      tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
      if (tem !== null) {
        return tem.slice(1).join(' ').replace('OPR', 'Opera');
      }
    }
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    tem = ua.match(/version\/(\d+)/i);
    if (tem !== null) {
      M.splice(1, 1, tem[1]);
    }

    return M[0].toLowerCase();
  }

  /**
   * adopt device name from navigator object of window
   * @static
   * @returns {string} device name
   * @memberof Client
   * @function
   */
  public static getDevice() {
    // definde device name
    let deviceName = '';

    /**
     * checks device belongs which company
     * @const
     * @type {object}
     */
    const isMobile = {
      Android: () => {
        return navigator.userAgent.match(/Android/i);
      },
      Datalogic: () => {
        return navigator.userAgent.match(/DL-AXIS/i);
      },
      Bluebird: () => {
        return navigator.userAgent.match(/EF500/i);
      },
      Honeywell: () => {
        return navigator.userAgent.match(/CT50/i);
      },
      Zebra: () => {
        return navigator.userAgent.match(/TC70|TC55/i);
      },
      BlackBerry: () => {
        return navigator.userAgent.match(/BlackBerry/i);
      },
      iOS: () => {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
      },
      Windows: () => {
        return navigator.userAgent.match(/IEMobile/i);
      },
      any: () => {
        return (isMobile.Datalogic()
          || isMobile.Bluebird()
          || isMobile.Honeywell()
          || isMobile.Zebra()
          || isMobile.BlackBerry()
          || isMobile.Android()
          || isMobile.iOS()
          || isMobile.Windows());
      },
    };

    /**
     * Assign device name
     */
    if (isMobile.Datalogic()) {
      deviceName = 'Datalogic';
    } else if (isMobile.Bluebird()) {
      deviceName = 'Bluebird';
    } else if (isMobile.Honeywell()) {
      deviceName = 'Honeywell';
    } else if (isMobile.Zebra()) {
      deviceName = 'Zebra';
    } else if (isMobile.BlackBerry()) {
      deviceName = 'BlackBerry';
    } else if (isMobile.iOS()) {
      deviceName = 'iOS';
    } else if ((deviceName === '') && (isMobile.Android())) {
      deviceName = 'Android';
    } else if ((deviceName === '') && (isMobile.Windows())) {
      deviceName = 'Windows';
    }
    return deviceName;
  }
}
