/**
 * @file scenes/Signin/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @description Authenticates the user using the given username and password and stores the user data
 *              Documented by:          Soroush Torkzadeh
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            robzizo
 *              Date of review:         2017-07-24
 *
 */

import * as React from 'react';
import {Input, Button, Form} from 'antd';
import {Link, hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {login, logout} from 'redux/app/actions';
import * as md5 from 'md5';
import Api from 'api';
import AccountApi from 'api/account';
import {ILoginResponse} from 'api/account/interfaces';
import {IUser} from 'api/interfaces';
import AAA from 'services/aaa';
import IValidatableField from '../IValidatableField';
import IValidationResult from '../IValidationResult';
import Failure from 'services/server/failure';
import Client from 'services/utils/client';
import nstTime from 'services/time';

const publicStyle = require('../public.css');
const signinStyle = require('./style.css');

interface IState {
  isLogin: boolean;
  username: IValidatableField;
  password: IValidatableField;
  inProgress: boolean;
  message: string;
}

interface IProps {
  isLogin: boolean;
  setLogin: (user: IUser) => {};
  setLogout: () => {};
  location: any;
}

/**
 *
 *
 * @class Signin
 * @classdesc Authenticates user with the provided username and password
 * @extends {React.Component<IProps, IState>}\
 */
class Signin extends React.Component<IProps, IState> {
  // ( document on assigns and defines )
  private accountApi: AccountApi = new AccountApi();
  private nestedTime = nstTime.getInstance();
  private api: Api;

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
      username: {
        message: null,
        status: null,
        value: '',
      },
      password: {
        message: null,
        status: null,
        value: '',
      },
      inProgress: false,
      message: null,
    };

    // Binds `this` (the component context) as these functions context
    this.submit = this.submit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);

    // // clear storage
    // if (process.env.BROWSER) {
    //   localStorage.removeItem('nested.server.domain');
    // }

    this.api = Api.getInstance();
  }

  public componentDidMount() {
    this.changeWorkspace(this.props.location.pathname);
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.changeWorkspace(newProps.location.pathname);
  }

  private changeWorkspace(path: string) {
    this.setState({
      inProgress: true,
    });
    const domain = path.split('/')[2];
    this.api.reconfigEndPoints(domain)
      .then(() => {
        this.setState({
          message: '',
          inProgress: false,
        });
      })
      .catch(() => {
        this.setState({
          message: 'Your provider is not valid!',
          inProgress: false,
        });
      });
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

    if (!this.validate()) {
      return;
    }

    // Prevents clicking on "Sign in" button multiple times
    // if authenticating is already in progress and is taking longer than usual
    this.setState({
      inProgress: true,
    });

    if (this.state.username.value.indexOf('@') > -1) {
      const usernameSplits = this.state.username.value.split('@');
      this.api.reconfigEndPoints(usernameSplits[1])
        .then(() => {
          this.login();
        })
        .catch((r) => {
          console.log(r);
          this.setState({
            message: 'Your provider is not valid!',
            inProgress: false,
          });
        });
    } else {
      this.login();
    }

  }

  private login() {
    const did = Client.getDid();
    const dt = Client.getDt();
    const dos = 'android';
    this.accountApi.login({
      uid: this.state.username.value.split('@')[0],
      pass: md5(this.state.password.value),
      _did: did,
      _do: dos,
      _dt: dt,
    })
      .then((response: ILoginResponse) => {
          // console.log(response);
          // Replaces the previous credentials that have been stored inside `AAA` service
          AAA.getInstance().setCredentials(response);

          // Puts the authenticated user data in `store.app` reducer
          this.props.setLogin(response.account);
          // Sets client time stamp
          this.nestedTime.setServerTime(response.server_timestamp);
          // Navigates to the default route which is `/feed`
          // todo back to previous url !
          hashHistory.push('/');
        },
        (error) => {
          console.log(error);
          if (error.err_code === Failure.INVALID) {
            this.setState({
              message: 'Invalid Username or Password',
            });
          } else if (error.err_code === Failure.ACCESS_DENIED && error.items[0] === 'disabled') {
            this.setState({
              message: 'Your account has been disabled! Contact Nested administrator to get more information.',
            });
          } else {
            this.setState({
              message: 'An error occurred in login. Please try again later',
            });
          }

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
    const validationResult = this.validateUsername(e.target.value);
    this.setState({
      username: Object.assign({value: e.target.value}, validationResult),
    });
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
    const validationResult = this.validatePassword(e.target.value);
    this.setState({
      password: Object.assign({value: e.target.value}, validationResult),
    });
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
          <div className={publicStyle.filler}/>
        </div>
        <h2>Sign in to Nested</h2>
        <Form className={[publicStyle.publicForm, signinStyle.signin].join(' ')}>
          <Form.Item
            validateStatus={this.state.username.status}
          >
            <Input
              placeholder="Username"
              value={this.state.username.value}
              onChange={this.handleUsernameChange}
            />
          </Form.Item>
          <Form.Item
            validateStatus={this.state.password.status}
          >
            <Input
              type="password"
              placeholder="Password"
              value={this.state.password.value}
              onChange={this.handlePasswordChange}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit" className={publicStyle.submit} onClick={this.submit}
          >
            <b>Sign in</b>
          </Button>
          <p className={publicStyle.detail}>Don't have an account? <Link to="/signup">Create a new account</Link></p>
          <p className={publicStyle.detail}><Link to="/workspace/force">Change Workspace</Link></p>
          {
            this.state.message &&
            (
              <Form.Item help={this.state.message} validateStatus="error"/>
            )
          }
        </Form>
      </div>
    );
  }

  private validateUsername(value?: string): IValidationResult {
    if (!value) {
      return {
        status: 'error',
        message: 'Required',
      } as IValidationResult;
    }

    return {
      status: 'success',
      message: null,
    } as IValidationResult;
  }

  private validatePassword(value?: string): IValidationResult {
    if (!value) {
      return {
        status: 'error',
        message: 'Required',
      } as IValidationResult;
    }

    return {
      status: 'success',
      message: null,
    } as IValidationResult;
  }

  private validate(): boolean {
    const usernameValidationResult = this.validateUsername(this.state.username.value);
    const passwordValidationResult = this.validatePassword(this.state.password.value);
    if (usernameValidationResult.status === 'success'
      && passwordValidationResult.status === 'success') {
      return true;
    }

    this.setState({
      username: Object.assign(this.state.username, usernameValidationResult),
      password: Object.assign(this.state.password, passwordValidationResult),
    });

    return false;
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
