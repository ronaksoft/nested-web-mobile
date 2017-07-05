import * as React from 'react';
import {Input, Button} from 'antd';
import {Link} from 'react-router';
import {browserHistory} from 'react-router';
const style = require('./style.css');
import {connect} from 'react-redux';
import {login, logout} from 'redux/app/actions';
import * as md5 from 'md5';
import AccountApi from 'api/account';
import {IUser, ILoginResponse} from 'api/account/interfaces';
import AAA from 'services/aaa';
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

class Signin extends React.Component<IProps, IState> {
  private accountApi: AccountApi = new AccountApi();
  constructor(props: any) {
    super(props);

    this.state = {
      isLogin: false,
      username: '',
      password: '',
      inProgress: false,
    };

    this.submit = this.submit.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.handleUsernameChange = this.handleUsernameChange.bind(this);
  }

  /**
   * Authenticate the user with the given username and password
   *
   * @private
   * @returns
   * @memberof Signin
   */
  private submit() {
    if (this.state.inProgress) {
      return;
    }

    this.setState({
      inProgress: true,
    });

    this.accountApi.login({
      uid: this.state.username,
      pass: md5(this.state.password),
    }).then((response: ILoginResponse) => {
      AAA.getInstance().setCredentials(response);
      this.props.setLogin(response.account);
      browserHistory.push('/');
    }, (error) => {
      console.log(error);
      this.setState({
        inProgress: false,
      });
    });
  }

  /**
   * Set username on user input
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
   * Set password on user input
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

  public render() {
    // const { getFieldDecorator } = this.props.form;
    return (
      <div>
        <div>
          <img src={require('./logo.svg')} className={style.logo} alt="Nested" style={{ width: 48, height: 48 }}/>
        </div>
        <h2>Sign in to Nested</h2>
        <div>
            <Input placeholder="Username" value={this.state.username} onChange={this.handleUsernameChange}/>
            <br />
            <Input
                  type="password"
                  placeholder="Password"
                  value={this.state.password}
                  onChange={this.handlePasswordChange}
            />
            <br />
            <Button type="primary" className={style.submit} onClick={this.submit}>
              <b>Sign in</b>
            </Button>
          <p>Don't have an account? <Link to="/signup">Create a new account</Link></p>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
});

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
