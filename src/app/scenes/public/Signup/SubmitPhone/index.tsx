import * as React from 'react';
import {browserHistory, Link} from 'react-router';
import PhoneInput from 'components/PhoneInput';
import {Button, Form} from 'antd';
import AccountApi from 'api/account';
import IValidationResult from '../IValidationResult';
const publicStyle = require('../../public.css');

interface IState {
  validation: IValidationResult;
}

class Phone extends React.Component<any, IState> {
  private phone: string;
  private country: string;
  private code: string;
  private accountApi: AccountApi;

  constructor() {
    super();
    this.state = {
      validation: {
        message: null,
        status: null,
      },
    };
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.submit = this.submit.bind(this);
    this.validate = this.validate.bind(this);
  }

  private validate() {
    let validation: IValidationResult = {
      status: 'success',
      message: null,
    };

    if (!this.country) {
      validation = {
        message: 'Please select your country',
        status: 'error',
      };
    }

    if (!this.code) {
      validation = {
        message: 'Please enter your country phone code',
        status: 'error',
      };
    }

    if (!this.phone) {
      validation = {
        message: 'Please enter your phone number',
        status: 'error',
      };
    }

    this.setState({
      validation,
    });

    return validation.status === 'success';
  }

  private handlePhoneChange(country: string, code: string, phone: string) {
    this.country = country;
    this.code = code;
    this.phone = phone;

    this.validate();
  }

  private submit() {
    if (!this.validate()) {
      return;
    }

    const phoneNumber = this.code + this.phone;
    this.accountApi.getVerification({
      phone: phoneNumber,
    }).then((data) => {

      const nextStepRoute = '/signup/verify/:country/:code/:phone/:vid'
        .replace(':country', this.country)
        .replace(':code', this.code)
        .replace(':phone', this.phone)
        .replace(':vid', data.vid);

      browserHistory.push(nextStepRoute);
    }, (error: any) => {
      console.log(error);
    });
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
  }

  public render() {
    return (
      <div>
        <h2>Create an account</h2>
        <Form className={publicStyle.publicForm}>
          <p>To create an account with Nested, please enter your phone number.</p>
          <Form.Item
                    validateStatus={this.state.validation.status}
                    help={this.state.validation.message}
          >
            <PhoneInput
                      onChange={this.handlePhoneChange}
                      autoLocate={true}
                      style={{width: '100%'}}
                      code={this.props.params.code}
                      phone={this.props.params.phone}
                      country={this.props.params.country}/>
          </Form.Item>
          <p className={publicStyle.detail}>Have an account? <Link to="/signin">Sign in</Link></p>
          <Button type="primary" className={publicStyle.submit} onClick={this.submit}>
            <b>Next</b>
          </Button>
        </Form>
      </div>
    );
  }
}

export default Phone;
