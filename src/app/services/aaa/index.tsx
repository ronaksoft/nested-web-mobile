import * as Cookies from 'cookies-js';

export default class AAA {
  private static instance: AAA;
  private nss: string;
  private nsk: string;

  /**
   * Returns the instance of AAA
   *
   * @static
   * @returns
   * @memberof AAA
   */
  public static getInstance() {
    if (!this.instance) {
      this.instance = new AAA();
    }

    return this.instance;
  }

  /**
   * Get the user credentials
   *
   * @returns
   * @memberof AAA
   */
  public getCredentials() {
    return {
      ss: this.nss,
      sk: this.nsk,
    };
  }

  /**
   * Set the user credentials
   *
   * @param {*} credential
   * @memberof AAA
   */
  public setCredentials(credential: any) {
    Cookies.set('nss', credential._ss);
    Cookies.set('nsk', credential._sk);
    this.nss = credential._ss;
    this.nsk = credential._sk;
  }

  /**
   * Clear the stored credentials
   *
   * @memberof AAA
   */
  public clearCredentials(): void {
    this.nss = null;
    this.nsk = null;
    Cookies.set('nss');
    Cookies.set('nsk');
  }

  /**
   * Creates an instance of AAA.
   * @memberof AAA
   */
  private constructor() {
    this.nss = Cookies.get('nss');
    this.nsk = Cookies.get('nsk');
  }

}
