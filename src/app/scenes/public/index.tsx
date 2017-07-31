/**
 * @file scenes/public/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description parent component for all pages that are accessable for not signed in users
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-31
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import Signin from './Signin';
import Signup from './Signup';
import NotFound from './notfound';
import AAA from 'services/aaa';

/**
 * 
 * 
 * @class Public
 * @classdesc This component renders the public scenes for not signed in users
 * @extends {React.Component<any, any>}
 */
class Public extends React.Component<any, any> {

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Public
   * @override
   * @generator
   */
  public render() {

    /**
     * @name credentials
     * @desc define the credentials
     * @type {object}
     */
    const credentials = AAA.getInstance().getCredentials();

    /**
     * @name hasCredentials
     * @desc Checks the credentials is fullfilled
     * @type {boolean}
     */
    const hasCredentials = !!(credentials.sk && credentials.ss);

    return (
      <div>
        {!hasCredentials && this.props.children}
      </div>
    );
  }
}

export { Public, Signin, Signup, NotFound };
