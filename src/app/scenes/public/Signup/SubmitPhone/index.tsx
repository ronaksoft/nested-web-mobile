/**
 * @file scenes/Signup/SubmitPhone/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Registration begins with submitting phone number. The user selects his/her country.
 * The country code appears according to the selected country. The user enters his/her
 * phone number and hits "Submit" button. We request a verification Id by sending country Id,
 * country-code, and phone number. An SMS will be sent to the provided phone number wich
 * contains a verification code. If you want to find how the code works,
 * see `scenes/Signup/Verify/index.tsx`.
 *
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-24
 * Reviewed by:            -
 * Date of review:         -
 *
 */

import * as React from 'react';
import {hashHistory, Link} from 'react-router';
import PhoneInput from 'components/PhoneInput';
import {Button, Form} from 'antd';
import AccountApi from 'api/account';
import IValidationResult from '../../IValidationResult';
import IErrorResponseData from 'services/server/interfaces/IErrorResponseData';
import Failure from 'services/server/failure';
import {debounce} from 'lodash';

const publicStyle = require('../../public.css');

interface IState {
  validation: IValidationResult;
}

class Phone extends React.Component<any, IState> {

  /**
   * @property phone
   * @desc A copy of entered phone number
   * @private
   * @type {string}
   * @memberof Phone
   */
  private phone: string;
  /**
   * @property country
   * @desc A copy of selected country ID e.g., IR
   * @private
   * @type {string}
   * @memberof Phone
   */
  private country: string;
  /**
   * @property code
   * @desc A copy of selected country code e.g., 98
   * @private
   * @type {string}
   * @memberof Phone
   */
  private code: string;
  /**
   * @property accoutApo
   * @desc An instance of AccountApi wich will be created when the coumponent did mount
   * @private
   * @type {AccountApi}
   * @memberof Phone
   */
  private accountApi: AccountApi;

  /**
   * Creates an instance of Phone.
   * @memberof Phone
   */
  constructor(props: any) {
    super();
    // sets the a default value for the component state
    this.state = {
      validation: {
        message: null,
        status: null,
      },
    };
    this.country = props.params.country;
    this.code = props.params.code;
    this.phone = props.params.phone;
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.submit = this.submit.bind(this);
    this.validate = debounce(this.validate.bind(this), 350);
  }

  /**
   * @function validate
   * @desc Validates country, country-code and phone number. Updates the state
   * with the result of validation. It returns true if all three has been provided
   * and the phone number is available to be used
   * @private
   * @returns {boolean}
   * @memberof Phone
   */
  private validate(): Promise<boolean> {
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

    if (validation.status === 'error') {
      this.setState({
        validation,
      });
      return Promise.resolve(false);
    }

    return new Promise((resolve) => {
      this.accountApi.phoneAvailable({
        phone: this.code + this.phone,
      }).then((isAvailable) => {
        if (!isAvailable) {
          validation = {
            message: 'The phone number is not available',
            status: 'error',
          };
        }

        this.setState({
          validation,
        });
        resolve(isAvailable);
      }, () => {
        validation = {
          message: 'Sorry, We can not validate your phone number! Please contact us.',
          status: 'error',
        };
        this.setState({
          validation,
        });
        resolve(false);
      });
    });

  }

  /**
   * @function
   * @private handlePhoneChange
   * @desc Keeps a local copy of country, code and phone and validates all
   * @param {string} country
   * @param {string} code
   * @param {string} phone
   * @borrows validate
   * @memberof Phone
   */
  private handlePhoneChange(country: string, code: string, phone: string) {
    this.country = country;
    this.code = code;
    this.phone = phone;

    this.validate();
  }

  /**
   * @function submit
   * @desc This will be triggered when a user hits Submit button. Before sending
   * the phone number and getting a verification code, We validate the values.
   * In case of success response, we use the receive verification code to route
   * to the next step
   * @private
   * @returns
   * @memberof Phone
   */
  private submit() {
    this.validate().then((isValid) => {
      if (!isValid) {
        return;
      }
      // Concatinates country-code and phone number because Server expects to receive both as `phone`
      const phoneNumber = this.code + this.phone;
      this.accountApi.getVerification({
        phone: phoneNumber,
      }).then((data) => {

        // TODO: Use es6 string interpolation
        const nextStep = `#/m/signup/verify/${this.country}/${this.code}/${this.phone}/${data.vid}`;

        hashHistory.push(nextStep);
      }, (error: IErrorResponseData) => {
        if (error.err_code === Failure.INVALID) {
          this.setState({
            validation: {
              message: 'Invalid phone number',
              status: 'error',
            },
          });
        } else {
          this.setState({
            validation: {
              message: 'An error has occured',
              status: 'error',
            },
          });
        }
      });
    });
  }

  /**
   * @function componentDidMount
   * @desc Creates a new instance of `AccountApi` when the component did mount
   * @memberof Phone
   */
  public componentDidMount() {
    this.accountApi = new AccountApi();
  }

  /**
   * @function render
   * @desc Renders the component
   *
   * @returns
   * @memberof Phone
   */
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
          <p className={publicStyle.detail}>Have an account? <Link to="#/m/signin">Sign in</Link></p>
          <Button type="primary" className={publicStyle.submit} onClick={this.submit}>
            <b>Next</b>
          </Button>
        </Form>
      </div>
    );
  }
}

export default Phone;
