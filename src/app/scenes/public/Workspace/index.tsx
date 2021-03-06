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
import {hashHistory} from 'react-router';
import {Input, Button, Form} from 'antd';
import {connect} from 'react-redux';
import Api from 'api';
import IValidatableField from '../IValidatableField';
import IValidationResult from '../IValidationResult';
import CONFIG from '../../../config';

const publicStyle = require('../public.css');
const signinStyle = require('./style.css');

interface IState {
  isLogin: boolean;
  workspace: IValidatableField;
  inProgress: boolean;
  message: string;
}

interface IProps {
  isLogin: boolean;
  location: any;
}

/**
 *
 *
 * @class Signin
 * @classdesc Authenticates user with the provided username and password
 * @extends {React.Component<IProps, IState>}\
 */
class Workspace extends React.Component<IProps, IState> {
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
      workspace: {
        message: null,
        status: null,
        value: '',
      },
      inProgress: false,
      message: null,
    };

    // Binds `this` (the component context) as these functions context
    this.submit = this.submit.bind(this);

    this.api = Api.getInstance();

    // // clear storage
    // if (process.env.BROWSER) {
    //   localStorage.removeItem('nested.server.domain');
    // }
  }

  public componentDidMount() {
    if (this.props.location.pathname !== '/workspace/force') {
      const domain = localStorage.getItem('nested.server.domain');
      if (domain && domain.length > 3) {
        this.gotoWorkspace(domain);
      } else {
        const host = window.location.host;
        this.getConfig(host).then((domainName) => {
          this.gotoWorkspace(domainName);
        }).catch(() => {
          this.setState({
            message: 'Your provider is not valid!',
            inProgress: false,
          });
        });
      }
    }
  }

  private getConfig(host) {
    return new Promise((resolve, reject) => {
      if (['web.nested.me', 'webapp.nested.me'].indexOf(host) > -1) {
        host = 'nested.me';
      }
      this.api.reconfigEndPoints(host).then(() => {
        resolve(host);
      }).catch(() => {
        if (typeof host !== 'string') {
          reject();
          return;
        }
        let parts = host.split('.');
        if (parts.length > 2) {
          parts = parts.reverse();
          const d = parts[1] + '.' + parts[0];
          if (d !== 'nested.me') {
            this.api.reconfigEndPoints(d).then(() => {
              resolve(host);
            }).catch((reason) => {
              reject(reason);
            });
          } else {
            reject();
          }
        } else {
          reject();
        }
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

    this.api.reconfigEndPoints(this.state.workspace.value)
      .then(() => {
        hashHistory.push(`/signin/${this.state.workspace.value}`);
      })
      .catch((r) => {
        console.log(r);
        this.setState({
          message: 'Your provider is not valid!',
          inProgress: false,
        });
      });
  }

  private gotoWorkspace(domain) {
    hashHistory.push(`/signin/${domain}`);
  }

  /**
   * @function handleUsernameChange
   * @description Set username on user input
   *
   * @private
   * @param {*} e
   * @memberof Signin
   */
  private handleWorkspaceChange = (e: any) => {
    const validationResult = this.validateWorkspace(e.target.value);
    this.setState({
      workspace: Object.assign({value: e.target.value}, validationResult),
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
    const domain = CONFIG().DOMAIN;
    return (
      <div className={publicStyle.publicPage}>
        <div className={publicStyle.publicHead}>
          <img src={require('../Signin/logo.svg')} className={publicStyle.logo} alt="Nested"/>
          <div className={publicStyle.filler}/>
        </div>
        <h2>Sign in to your workspace</h2>
        <Form className={[publicStyle.publicForm, signinStyle.signin].join(' ')}>
          <p>Enter your Domain to sign in.</p>
          <Form.Item
            validateStatus={this.state.workspace.status}
          >
            <Input
              placeholder={`e.g., ${domain}`}
              value={this.state.workspace.value}
              onChange={this.handleWorkspaceChange}
            />
          </Form.Item>
          <Button
            type="primary"
            htmlType="submit" className={publicStyle.submit} onClick={this.submit}
          >
            <b>Sign in</b>
          </Button>
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

  private validateWorkspace(value?: string): IValidationResult {
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
    const workspaceValidationResult = this.validateWorkspace(this.state.workspace.value);
    if (workspaceValidationResult.status === 'success') {
      return true;
    }

    this.setState({
      workspace: Object.assign(this.state.workspace, workspaceValidationResult),
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

export default connect(mapStateToProps, {})(Workspace);
