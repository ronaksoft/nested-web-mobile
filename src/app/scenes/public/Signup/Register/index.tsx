import * as React from 'react';
import {browserHistory} from 'react-router';
import {Input, Button, Form} from 'antd';
import AccountApi from 'api/account';
import * as md5 from 'md5';
import IValidatableField from '../IValidatableField';
import IValidationResult from '../IValidationResult';
const publicStyle = require('../../public.css');
const style = require('./register.css');

const VALID_CHAR_REGEX = /^[a-zA-Z0-9-.]+$/;
const DOT_REGEX = /\./;
const SEQUENCE_DASHES_REGEX = /--/;
const START_WITH_DASH_AND_NUMBER_REGEX = /^(-|[0-9])/;
const END_WITH_DASH_REGEX = /-$/;
const EMAIL_REGEX = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

interface IParams {
  country: string;
  code: string;
  phone: string;
  vid: string;
}

interface IState {
  username: IValidatableField;
  password: IValidatableField;
  firstName: IValidatableField;
  lastName: IValidatableField;
  email: IValidatableField;
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
      username: {
        message: null,
        status: null,
        value: null,
      },
      password: {
        message: null,
        status: null,
        value: null,
      },
      firstName: {
        message: null,
        status: null,
        value: null,
      },
      lastName: {
        message: null,
        status: null,
        value: null,
      },
      email: {
        message: null,
        status: null,
        value: null,
      },
      submitting: false,
    };
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
  }

  private validateUsername = (value?: string): Promise<IValidationResult> => {
    if (!value) {
      return Promise.resolve({
        status: 'error',
        message: 'required',
      });
    }

    if (!VALID_CHAR_REGEX.test(value)) {
      return Promise.resolve({
        status: 'error',
        message: 'alphanumeric and dash(-) only',
      });
    }

    if (DOT_REGEX.test(value)) {
      return Promise.resolve({
        status: 'error',
        message: 'dot(.) is not allowed',
      });
    }

    if (SEQUENCE_DASHES_REGEX.test(value)) {
      return Promise.resolve({
        status: 'error',
        message: 'Sequence dashes (--) are not allowed',
      });
    }

    if (START_WITH_DASH_AND_NUMBER_REGEX.test(value)) {
      return Promise.resolve({
        status: 'error',
        message: 'Do not start your username with a number (0-9) or a dash (-)',
      });
    }

    if (END_WITH_DASH_REGEX.test(value)) {
      return Promise.resolve({
        status: 'error',
        message: 'Do not end your username with a dash (-)',
      });
    }

    if (value.length < 4) {
      return Promise.resolve({
        status: 'error',
        message: 'The username is too short',
      });
    }

    if (value.length > 32) {
      return Promise.resolve({
        status: 'error',
        message: 'The username is too long',
      });
    }

    const intermediateState: IValidatableField = {
      message: null,
      status: 'validating',
      value,
    };

    this.setState({
      username: intermediateState,
    });

    return new Promise((resolve) => {
      this.accountApi.usernameAvailable({
        account_id: value,
      }).then((available: boolean) => {
        if (available) {
          resolve({
            status: 'success',
            message: null,
          });
        } else {
          resolve({
            status: 'error',
            message: 'The username is not available',
          });
        }
      });
    });

  }

  private handleUsernameChange = (e: any) => {
    this.setState({
      username: Object.assign(this.state.username, {value: e.target.value}),
    });

    this.validateUsername(e.target.value).then((result) => {
      this.setState({
        username: Object.assign(this.state.username, result),
      });
    });
  }

  private validatePassword = (value?: string): Promise<IValidationResult> => {
    if (!value) {
      return Promise.resolve({
        status: 'error',
        message: 'Required',
      });
    }

    if (value.length < 6) {
      return Promise.resolve({
        status: 'error',
        message: 'Password must be at least 6 character',
      });
    }

    if (value.length > 128) {
      return Promise.resolve({
        status: 'error',
        message: 'Password is too long',
      });
    }

    return Promise.resolve({
      status: 'success',
      message: null,
    });
  }

  private handlePasswordChange = (e: any) => {
    this.setState({
      password: Object.assign(this.state.password, {value: e.target.value}),
    });

    this.validatePassword(e.target.value).then((result) => {
      this.setState({
        password: Object.assign(this.state.password, result),
      });
    });
  }

  private validateFirstName = (value?: string): Promise<IValidationResult> => {
    if (!value) {
      return Promise.resolve({
        status: 'error',
        message: 'Required',
      });
    }

    if (value.length > 35) {
      return Promise.resolve({
        status: 'error',
        message: 'First name is too long',
      });
    }

    return Promise.resolve({
      status: 'success',
      message: null,
    });
  }

  private handleFirstNameChange = (e: any) => {
    this.setState({
      firstName: Object.assign(this.state.firstName, {value: e.target.value}),
    });

    this.validateFirstName(e.target.value).then((result) => {
      this.setState({
        firstName: Object.assign(this.state.firstName, result),
      });
    });
  }

  private validateLastName = (value?: string): Promise<IValidationResult> => {
    if (!value) {
      return Promise.resolve({
        status: 'error',
        message: 'Required',
      });
    }

    if (value.length > 35) {
      return Promise.resolve({
        status: 'error',
        message: 'First name is too long',
      });
    }

    return Promise.resolve({
      status: 'success',
      message: null,
    });
  }

  private handleLastNameChange = (e: any) => {
    this.setState({
      lastName: Object.assign(this.state.lastName, {value: e.target.value}),
    });

    this.validateLastName(e.target.value).then((result) => {
      this.setState({
        lastName: Object.assign(this.state.lastName, result),
      });
    });
  }

  private validateEmail = (value?: string): Promise<IValidationResult> => {
    if (value && value.length > 256) {
      return Promise.resolve({
        status: 'error',
        message: 'Email is too long',
      });
    }

    if (value && !EMAIL_REGEX.test(value)) {
      return Promise.resolve({
        status: 'error',
        message: 'Email is not valid',
      });
    }

    return Promise.resolve({
      status: 'success',
      message: null,
    });
  }

  private handleEmailChange = (e: any) => {
    this.setState({
      email: Object.assign(this.state.email, {value: e.target.value}),
    });

    this.validateEmail(e.target.value).then((result) => {
      this.setState({
        email: Object.assign(this.state.email, result),
      });
    });
  }

  private validate = (callback: (isValid: boolean) => void): void => {
    Promise.all([
      this.validateUsername(this.state.username.value),
      this.validatePassword(this.state.password.value),
      this.validateFirstName(this.state.firstName.value),
      this.validateLastName(this.state.lastName.value),
      this.validateEmail(this.state.email.value),
    ]).then((fields) => {
      this.setState({
        username: Object.assign(this.state.username, fields[0]),
        password: Object.assign(this.state.password, fields[1]),
        firstName: Object.assign(this.state.firstName, fields[2]),
        lastName: Object.assign(this.state.lastName, fields[3]),
        email: Object.assign(this.state.email, fields[4]),
      });

      callback(fields.every((i) => i.status === 'success'));
    });
  }

  private submit = () => {
    this.validate((isValid) => {
      if (!isValid) {
        return;
      }

      this.setState({
        submitting: true,
      });
      this.accountApi.register({
        vid: this.props.params.vid,
        country: this.props.params.country,
        phone: this.props.params.code + this.props.params.phone,
        uid: this.state.username.value,
        pass: md5(this.state.password.value),
        fname: this.state.firstName.value,
        lname: this.state.lastName.value,
        email: this.state.email.value,
      }).then(() => {
        browserHistory.push('/m/signin');
      }, () => {
        this.setState({
          submitting: false,
        });
      });
    });
  }

  public render() {
    return (
      <Form>
        <h2>Create an account</h2>
        <div className={[publicStyle.publicForm, style.register].join(' ')}>
          <p>Hooray :) Please continue to complete your account information.</p>
          <Form.Item
                    help={this.state.username.message}
                    validateStatus={this.state.username.status}
          >
            <label>Choose your username</label>
            <Input value={this.state.username.value} onChange={this.handleUsernameChange} />
          </Form.Item>
          <Form.Item
                    help={this.state.password.message}
                    validateStatus={this.state.password.status}
          >
            <label>Set a password</label>
            <Input value={this.state.password.value} onChange={this.handlePasswordChange} />
          </Form.Item>
          <Form.Item
                    help={this.state.firstName.message}
                    validateStatus={this.state.firstName.status}
          >
            <label>First Name</label>
            <Input value={this.state.firstName.value} onChange={this.handleFirstNameChange} />
          </Form.Item>
          <Form.Item
                    help={this.state.lastName.message}
                    validateStatus={this.state.lastName.status}
          >
            <label>Sure Name</label>
            <Input value={this.state.lastName.value} onChange={this.handleLastNameChange} />
          </Form.Item>
          <Form.Item
                    help={this.state.email.message}
                    validateStatus={this.state.email.status}
          >
            <label>Email</label>
            <Input value={this.state.email.value} onChange={this.handleEmailChange}/>
          </Form.Item>
          <p>By proceeding to create a Nested account, you are agreeing to our <a href="#">Terms and Conditions</a>.</p>
          <Button type="primary" onClick={this.submit} style={{width: '100%'}} disabled={this.state.submitting}>
            <b>{this.state.submitting ? 'Submitting...' : 'Finish'}</b>
          </Button>
        </div>
      </Form>
    );
  }
}

export default Register;
