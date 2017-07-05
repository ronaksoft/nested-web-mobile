import * as Cookies from 'cookies-js';

export default class AAA {
  private static instance: AAA;
  private nss: string;
  private nsk: string;

  public static getInstance() {
    if (!this.instance) {
      this.instance = new AAA();
    }

    return this.instance;
  }

  public getCredentials() {
    return {
      ss: this.nss,
      sk: this.nsk,
    };
  }

  public setCredentials(credential: any) {
    Cookies.set('nss', credential._ss);
    Cookies.set('nsk', credential._sk);
    this.nss = credential._ss;
    this.nsk = credential._sk;
  }

  public clearCredentials(): void {
    this.nss = null;
    this.nsk = null;
    Cookies.set('nss');
    Cookies.set('nsk');
  }

  private constructor() {
    this.nss = Cookies.get('nss');
    this.nsk = Cookies.get('nsk');
  }

}
