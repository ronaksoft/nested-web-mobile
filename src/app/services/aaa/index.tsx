/**
 * @file services/aaa.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description Authentication-Authorization-Accounting
 * The name is too big for a service that manages the authenticated user data
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-25
 * Reviewed by:            robzizo
 * Date of review:         2017-08-01
 */

import * as Cookies from 'cookies-js';

/**
 * @class AAA
 * @desc A signletone class that stores the authenticated user data
 * @export
 */
export default class AAA {
  /**
   * @prop instance
   * @desc An instance of AAA.
   * @private
   * @static
   * @type {AAA}
   * @memberof AAA
   */
  private static instance: AAA;

  /**
   * @prop nss
   * @desc Stands for Nested Session Secret. This is for authentication and does not work without `nsk`.
   * @private
   * @type {string}
   * @memberof AAA
   * @see nsk
   */
  private nss: string;
  /**
   * @prop nsk
   * @desc Stands for Nested Session Key. You usually find this key with `nss` and both are required to authentication.
   * @private
   * @type {string}
   * @memberof AAA
   * @see nss
   */
  private nsk: string;

  /**
   * @func getInstance
   * @desc The class constructor is private. This method creates an instance of AAA once
   * and returns the instance everytime you call it
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
   * @func getCredentials
   * @desc Get the user credentials
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
   * @func setCredentials
   * @desc Set the user credentials cookies
   * @param {*} credential
   * @memberof AAA
   */
  public setCredentials(credential: any) {
    if (typeof window !== 'undefined') {
      Cookies.set('nss', credential._ss, {expires: new Date(Date.now() + (30 * 1000 * 60 * 60 * 24))});
      Cookies.set('nsk', credential._sk, {expires: new Date(Date.now() + (30 * 1000 * 60 * 60 * 24))});
    }
    this.nss = credential._ss;
    this.nsk = credential._sk;
  }

  /**
   * @func clearCredentials
   * @desc Clear the stored credentials
   * @memberof AAA
   */
  public clearCredentials(): void {
    this.nss = null;
    this.nsk = null;
    if (typeof window !== 'undefined') {
      Cookies.set('nss');
      Cookies.set('nsk');
    }
  }

  /**
   * @constructor
   * @desc Creates an instance of AAA.
   * @memberof AAA
   */
  private constructor() {
    if (typeof window !== 'undefined') {
      this.nss = Cookies.get('nss');
      this.nsk = Cookies.get('nsk');
    }
  }

}
