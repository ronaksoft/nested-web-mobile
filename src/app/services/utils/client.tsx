import Platform from 'react-platform-js';
import * as Cookies from 'cookies-js';

class Client {

  private static getExpiresTime() {
    return new Date(Date.now() + (30 * 1000 * 60 * 60 * 24));
  }

  public static getCid() {
    let cid = null;
    if (typeof window !== 'undefined') {
      cid = Cookies.get('ncid');
    }

    if (!cid) {
      cid = ['web', Platform.DeviceType || 'desktop', Platform.Browser, Platform.OS].join('_');
      Client.setCid(cid);
    }

    return cid;
  }

  public static setCid(cid: string): void {
    if (typeof window !== 'undefined') {
      if (!cid) {
        Cookies.set('ncid', cid, {expires: Client.getExpiresTime()});
      } else {
        Cookies.set('ncid');
      }
    }
  }

  public static getDid(): string {
    const did = Cookies.get('ndid');
    if (did) {
      return did;
    }

    return 'web_' + Date.now() + '-' + Client.guid() + '-' + Client.guid();
  }

  public static setDid(did: string): void {
    if (typeof window !== 'undefined') {
      if (!did) {
        Cookies.set('ndid', did, {expires: Client.getExpiresTime()});
      } else {
        Cookies.set('ndid');
      }
    }
  }

  public static getDt(): string {
    if (typeof window !== 'undefined') {
      return Cookies.get('ndt');
    }

    return null;
  }

  public static setDt(dt: string): void {
    if (typeof window !== 'undefined') {
      if (dt) {
        Cookies.set('ndt', dt, {expires: Client.getExpiresTime()});
      } else {
        Cookies.set('ndt');
      }
    }
  }

  public static getDo(): string {
    if (typeof window !== 'undefined') {
      return Cookies.get('ndo');
    }
  }

  public static setDo(os: string): void {
    if (typeof window !== 'undefined') {
      if (os) {
        Cookies.set('ndo', os, {expires: Client.getExpiresTime()});
      } else {
        Cookies.set('ndo');
      }
    }
  }

  private static guid(): string {
    const s4 = (): string => {
      return Math.floor((1 + Math.random()) * 0x10000)
        .toString(16)
        .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
      s4() + '-' + s4() + s4() + s4();
  }
}

export default Client;
