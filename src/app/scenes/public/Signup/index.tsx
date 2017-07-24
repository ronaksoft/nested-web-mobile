/**
 * @file scenes/Signup/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Creates an account in 3 steps. This component is just a container
 * for SubmitPhone, Verify and Register components and does not have
 * any important logic about registration process
 * Documented by: Soroush Torkzadeh
 * Date of documentation:  2017-07-22
 * Reviewed by:            -
 * Date of review:         -
 */

import * as React from 'react';
import SubmitPhone from './SubmitPhone';
import Register from './Register';
import Verify from './Verify';

const publicStyle = require('../public.css');

/**
 * @class Signup
 * @desc Creates a new account in 3 steps:
 *          1. Submit phone number
 *          2. Verify phone number
 *          3. Enter account information
 *       These 3 steps are defined as child routes of this component
 *
 * @extends {React.Component<any, any>}
 */
class Signup extends React.Component<any, any> {
  /**
   * @function render
   * @desc Renders the component
   * @returns
   * @memberof Signup
   */
  public render() {
    return (
      <div className={publicStyle.publicPage}>
        <div className={publicStyle.publicHead}>
          <img src={require('./logo.svg')} className={publicStyle.logo} alt="Nested"/>
          <div className={publicStyle.filler}/>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Signup;
export {SubmitPhone, Verify, Register};
