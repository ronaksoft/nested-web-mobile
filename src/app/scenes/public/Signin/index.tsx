/**
 * @file scenes/Signin/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description Authenticates the user using the given username and password and stores the user data
 *              Documented by:          Soroush Torkzadeh
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            -
 *              Date of review:         -
 *
 */

import * as React from 'react';
import {Input, Button} from 'antd';
import {Link, browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {login, logout} from 'redux/app/actions';
import * as md5 from 'md5';
import AccountApi from 'api/account';
import {IUser, ILoginResponse} from 'api/account/interfaces';
import AAA from 'services/aaa';

const publicStyle = require('../public.css');

interface IState {
  isLogin: boolean;
  username: string;
  password: string;
  inProgress: boolean;
}

interface IProps {
  isLogin: boolean;
  setLogin: (user: IUser) => {};
  setLogout: () => {};
}

/**
 *
 *
 * @class Signin
 * @classdesc Authenticates user with the provided username and password
 * @extends {React.Component<IProps, IState>}
 */
class Signin extends React.Component<IProps, IState> {
  private accountApi: AccountApi = new AccountApi();
  /**
   * Creates an instance of Signin.
   * @param {*} props
   * @memberof Signin
   */
  // TODO: Use IProps as `props` type
  constructor(props: any) {
    super(props);

    this.state = {
      isLogin: false,
      username: '',
      password: '',
      inProgress: false,
    };

    // Binds `this` (the component context) as these functions context
    this.submit = this.submit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  /**
   * @function submit
   * @description Authenticates and registers a new session using the provided username and password and
   * Puts the user data in `store.app` if he/she has been authenticated successfully
   * @borrows {AccountApi.login, md5}
   * @private
   * @returns
   * @memberof Signin
   */
  private submit() {
    if (this.state.inProgress) {
      return;
    }

    // Prevents clicking on "Sign in" button multiple times
    // if authenticating is already in progress and is taking longer than usual
    this.setState({
      inProgress: true,
    });

    this.accountApi.login({
      uid: this.state.username,
      pass: md5(this.state.password),
    }).then((response: ILoginResponse) => {

      // Replaces the previous credentials that have been stored inside `AAA` service
      AAA.getInstance().setCredentials(response);

      // Puts the authenticated user data in `store.app` reducer
      this.props.setLogin(response.account);

      // Navigates to the default route which is `/feed`
      browserHistory.push('/');
    }, (error) => {

      // TODO: Warn the user if the authentication was unsuccessful with an appropriate reason
      console.log(error);

      // Enables "Sign in" button. This lets the user try again
      this.setState({
        inProgress: false,
      });
    });
  }

  /**
   * @function handleUsernameChange
   * @description Set username on user input
   *
   * @private
   * @param {*} e
   * @memberof Signin
   */
  private handleUsernameChange(e: any) {
    if (this.state.username !== e.target.value) {
      this.setState({
        username: e.target.value,
      });
    }
  }

  /**
   * @function handlePasswordChange
   * @description Set password on user input
   *
   * @private
   * @param {*} e
   * @memberof Signin
   */
  private handlePasswordChange(e: any) {
    if (this.state.password !== e.target.value) {
      this.setState({
        password: e.target.value,
      });
    }
  }

  /**
   * @function render
   * @description Renders the component
   *
   * @returns
   * @memberof Signin
   */
  public render() {
    return (
      <div className={publicStyle.publicPage}>
        <div className={publicStyle.publicHead}>
          <img src={require('./logo.svg')} className={publicStyle.logo} alt="Nested"/>
          <div className={publicStyle.filler} />
        </div>
        <h2>Sign in to Nested</h2>
        <div className={publicStyle.publicForm}>
            <Input placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}/>
            <br />
            <Input
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
            />
            <br />
            <Button type="primary" disabled={this.state.username.length === 0 && this.state.password.length === 0}
            htmlType="submit" className={publicStyle.submit} onClick={this.submit}>
              <b>Sign in</b>
            </Button>
          <p className={publicStyle.detail}>Don't have an account? <Link to="/m/signup">Create a new account</Link></p>
        </div>
      </div>
    );
  }

}

/**
 * @function mapStateToProps
 * @description Provides `store.app.isLogin` from the store to identify whether he/she is loged-in or not
 *
 * @param {any} store
 */
const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
});

/**
 * @function mapDispatchToProps
 * @description Provides `login` and `logout` actions through `props`
 *
 * @param {any} dispatch
 * @returns
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setLogin: (user: IUser) => {
      dispatch(login(user));
    },
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signin);
