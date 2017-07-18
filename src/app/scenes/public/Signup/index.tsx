import * as React from 'react';
import SubmitPhone from './SubmitPhone';
import Register from './Register';
import Verify from './Verify';
const publicStyle = require('../public.css');

class Signup extends React.Component<any, any> {
  public render() {
    return (
      <div className={publicStyle.publicPage}>
        <div className={publicStyle.publicHead}>
          <img src={require('./logo.svg')} className={publicStyle.logo} alt="Nested"/>
          <div className={publicStyle.filler} />
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Signup;
export {SubmitPhone, Verify, Register};
