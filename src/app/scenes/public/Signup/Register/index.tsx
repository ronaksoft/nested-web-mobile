import * as React from 'react';
import {browserHistory} from 'react-router';
import {Input, Button} from 'antd';
import AccountApi from 'api/account';
import * as md5 from 'md5';

interface IParams {
  country: string;
  code: string;
  phone: string;
  vid: string;
}

interface IState {
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  email: string;
  submitting: boolean;
}

interface IProps {
  params: IParams;
}

class Register extends React.Component<IProps, IState> {
  private accountApi: AccountApi;

  constructor() {
    super();

    this.state = {
      username: null,
      password: null,
      firstName: null,
      lastName: null,
      email: null,
      submitting: false,
    };
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
  }

  private handleUsernameChange = (e: any) => {
    this.setState({
      username: e.target.value,
    });
  }

  private handlePasswordChange = (e: any) => {
    this.setState({
      password: e.target.value,
    });
  }

  private handleFirstNameChange = (e: any) => {
    this.setState({
      firstName: e.target.value,
    });
  }

  private handleLastNameChange = (e: any) => {
    this.setState({
      lastName: e.target.value,
    });
  }

  private handleEmailChange = (e: any) => {
    this.setState({
      email: e.target.value,
    });
  }

  private submit = () => {
    this.setState({
      submitting: true,
    });
    this.accountApi.register({
      vid: this.props.params.vid,
      country: this.props.params.country,
      phone: this.props.params.code + this.props.params.phone,
      uid: this.state.username,
      pass: md5(this.state.password),
      fname: this.state.firstName,
      lname: this.state.lastName,
      email: this.state.email,
    }).then(() => {
      browserHistory.push('/signin');
    }, () => {
      this.setState({
        submitting: false,
      });
    });
  }

  public render() {
    return (
      <div>
        <p>Hooray :) Please continue to complete your account information.</p>
        <div>
          <label>Choose your username</label>
          <Input value={this.state.username} onChange={this.handleUsernameChange} />
        </div>
        <div>
          <label>Set a password</label>
          <Input value={this.state.password} onChange={this.handlePasswordChange} />
        </div>
        <div>
          <label>First Name</label>
          <Input value={this.state.firstName} onChange={this.handleFirstNameChange} />
        </div>
        <div>
          <label>Sure Name</label>
          <Input value={this.state.lastName} onChange={this.handleLastNameChange} />
        </div>
        <div>
          <label>Email</label>
          <Input value={this.state.email} onChange={this.handleEmailChange} />
        </div>
        <p>By proceeding to create a Nested account, you are agreeing to our <a href="#">Terms and Conditions</a>.</p>
        <Button type="primary" style={{width: '100%'}} onClick={this.submit} disabled={this.state.submitting}>
          <b>{this.state.submitting ? 'Submitting...' : 'Finish'}</b>
        </Button>
      </div>
    );
  }
}

export default Register;
