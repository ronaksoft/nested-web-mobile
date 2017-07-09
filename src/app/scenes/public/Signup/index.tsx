import * as React from 'react';
import SubmitPhone from './SubmitPhone';
import Register from './Register';
import Verify from './Verify';

class Signup extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <div>
          <img src={require('./logo.svg')} alt="Nested" style={{ width: 48, height: 48 }}/>
        </div>
        {this.props.children}
      </div>
    );
  }
}

export default Signup;
export {SubmitPhone, Verify, Register};
