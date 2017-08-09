
import Platform from 'react-platform-js';
import * as Cookies from 'cookies-js';

class Client {
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
      Cookies.set('ncid', cid, { expires: 365 });
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
      Cookies.set('ndid', did, { expires: 365 });
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
      Cookies.set('ndt', dt, { expires: 365 });
    }
  }

  public static getDo(): string {
    if (typeof window !== 'undefined') {
      return Cookies.get('ndo');
    }
  }

  public static setDo(os: string): void {
    if (typeof window !== 'undefined') {
      Cookies.set('ndo', os, { expires: 365 });
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
