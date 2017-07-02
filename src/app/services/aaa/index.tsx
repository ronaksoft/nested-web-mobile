import * as Cookies from 'cookies-js';

export default class AAA {
  private static instance: AAA;
  private hasUserCookie: boolean;
  private nss: string;
  private nsk: string;
  private account: any;
  private isAthenticated: boolean = false;

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
    this.hasUserCookie = this.checkUserCookie();
  }

  public setUser(account: any): void {
    this.account = account;
    this.isAthenticated = true;
    console.log(account, this);
  }

  public getUser(): any {
    return this.account;
  }

  public setIsUnAthenticated(): void {
    this.isAthenticated = false;
    this.nss = null;
    this.nsk = null;
    Cookies.set('nss');
    Cookies.set('nsk');
    this.account = null;
  }

  public hasUser(): Promise <boolean> {
    return new Promise((res) => {
      if (this.checkUserCookie()) {
        res(false);
      } else {
        res(false);
      }
    });
  }

  private constructor() {
    this.hasUserCookie = this.checkUserCookie();
    this.nss = Cookies.get('nss');
    this.nsk = Cookies.get('nsk');
  }

  private checkUserCookie(): boolean {
    const nss = Cookies.get('nss');
    const nsk = Cookies.get('nsk');
    return (nss && nsk);
  };

}
