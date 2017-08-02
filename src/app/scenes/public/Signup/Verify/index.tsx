/**
 * @file scenes/Signup/Veify/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc In the second step of registration, the user must have a 6-digit verification code
 * which was sent to him/her via SMS. If the code was not delivered for any reason, He/She
 * is able to request a call or another SMS using the buttons in the component. The user enters
 * the code and will be routed to the next step if his/her phone number was verified successfully.
 * In the next and the last step, the user writes his/her account information.
 *
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-24
 * Reviewed by:            robzizo
 * Date of review:         2017-07-24
 *
 */

import * as React from 'react';
import {browserHistory, Link} from 'react-router';
import {Input, Button, Form} from 'antd';
import AccountApi from 'api/account';
import Waiting from './Waiting';
import ValidationStatus from '../../ValidationStatus';
import IValidationResult from '../../IValidationResult';
import IErrorResponseData from 'services/server/interfaces/IErrorResponseData';
import Failure from 'services/server/failure';

const style = require('./verify.css');
const publicStyle = require('../../public.css');

/**
 * @interface IParams
 * @desc The parameters that the component receives in url
 */
interface IParams {
  /**
   * @property country
   * @desc The selected country Id e.g., IR or UK
   * @type {string}
   * @memberof IParams
   */
  country: string;
  /**
   * @property code
   * @desc The selected country code e.g., 98 or 322
   * @type {string}
   * @memberof IParams
   */
  code: string;
  /**
   * @property phone
   * @desc The selected phone number
   * @type {string}
   * @memberof IParams
   */
  phone: string;

  /**
   * @property vid
   * @desc A verification Id wich was received in first step
   * @type {string}
   * @memberof IParams
   */
  vid: string;
}

interface IState {
  /**
   * @property verificationCode
   * @desc A code that was sent to a user and he/she writes in the specified box
   * @type {string}
   * @memberof IState
   */
  verificationCode: string;
  /**
   * @property sendingText
   * @desc Indicates requesting for resending is in progress.
   * @type {boolean}
   * @memberof IState
   */
  sendingText: boolean;
  /**
   * @property callingPhone
   * @desc Indicates requesting for a call is in progress
   * @type {boolean}
   * @memberof IState
   */
  callingPhone: boolean;
  /**
   * @property sendTextWaiting
   * @desc You have to wait a while to request another SMS and this property value
   * changes when you will be able to do it again
   * @type {boolean}
   * @memberof IState
   */
  sendTextWaiting: boolean;
  /**
   * @property callPhoneWaiting
   * @desc You have to wait a while to request a phone call and this property value
   * changes when you will be able to do it again
   * @type {boolean}
   * @memberof IState
   */
  callPhoneWaiting: boolean;
  /**
   * @property validateStatus
   * @desc The result of validation
   * @type {ValidationStatus}
   * @memberof IState
   */
  validateStatus?: ValidationStatus;
  /**
   * @property validationMessage
   * @desc A hint message that will be displayed if there is an error in validating the verification code
   * @type {string}
   * @memberof IState
   */
  validationMessage?: string;
}

/**
 * @interface IProps
 * @desc The properties that component receives
 * @interface IProps
 */
interface IProps {

  /**
   * @property params
   * @desc The parameters that will be given to the component by our router
   * @type {IParams}
   * @memberof IProps
   */
  params: IParams;
}

// A valid verification code matches this regular expression. It should be just numbers and a length of exactly 6
const CODE_REGEX = /^[0-9]{6}$/;

/**
 * @class Verify
 * @classdesc The component visualizes the 2nd step of registration. A user writes the verification code that was sent
 * to him in the previous step. The user is also able to request a call or another SMS if he/she have not received an
 * SMS yet.
 * @extends {React.Component<IProps, IState>}
 */
class Verify extends React.Component<IProps, IState> {
  /** (Need Doc) */
  private accountApi: AccountApi;

  /** (Need Doc) */
  constructor(props: any) {
    super(props);

    // set default values of the component state
    this.state = {
      verificationCode: null,
      sendingText: false,
      callingPhone: false,
      sendTextWaiting: false,
      callPhoneWaiting: false,
    };

    this.handleVerificationCodeChange = this.handleVerificationCodeChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  /**
   * @function handleVerificationCodeChange
   * @desc Stores and validates the value of verification code input on every change
   * @borrows Verify.validateVerificationCode
   * @private
   * @memberof Verify
   */
  private handleVerificationCodeChange = (e: any) => {
    const validationResult = this.validateVerificationCode(e.target.value);
    this.setState({
      verificationCode: e.target.value,
      validateStatus: validationResult.status,
      validationMessage: validationResult.message,
    });
  }

  /**
   * @function validateVerificationCode
   * @desc Validates the code and returns the result
   * @private
   * @memberof Verify
   */
  private validateVerificationCode = (value: string): IValidationResult => {
    if (!value) {
      return {
        status: 'error',
        message: 'Required',
      };
    }

    if (!CODE_REGEX.test(value)) {
      return {
        status: 'error',
        message: 'Invalid',
      };
    }

    return {
      status: 'success',
      message: null,
    };
  }

  /**
   * @function validate
   * @desc Validates the code and updates the state with the result of that
   * @private
   * @memberof Verify
   * @borrows validateVerificationCode
   */
  private validate = (): boolean => {
    const result = this.validateVerificationCode(this.state.verificationCode);
    if (result.status !== 'success') {
      this.setState({
        validateStatus: result.status,
        validationMessage: result.message,
      });

      return false;
    }

    return true;
  }

  /**
   * (need doc)
   * @private
   * @memberof Verify
   */
  private submit = () => {
    if (!this.validate()) {
      return;
    }
    this.accountApi.verifyCode({
      code: this.state.verificationCode,
      vid: this.props.params.vid,
    }).then(() => {
      const nextStepRoute = '/m/signup/register/:country/:code/:phone/:vid'
        .replace(':country', this.props.params.country)
        .replace(':code', this.props.params.code)
        .replace(':phone', this.props.params.phone)
        .replace(':vid', this.props.params.vid);

      browserHistory.push(nextStepRoute);
    }, (error: IErrorResponseData) => {
      if (error.err_code === Failure.INVALID) {
        this.setState({
          validateStatus: 'error',
          validationMessage: 'Wrong code',
        });
      } else {
        this.setState({
          validateStatus: 'error',
          validationMessage: 'An error has occured',
        });
      }
    });
  }

  /**
   * @function resend
   * @desc Requests for sending another SMS and updates the state with the result of action
   * @private
   * @memberof Verify
   * @borrows accountApi.sendText
   */
  private resend = () => {
    this.setState({
      sendingText: true,
      sendTextWaiting: true,
    });

    this.accountApi.sendText({
      vid: this.props.params.vid,
    }).then(() => {
      this.setState({
        sendingText: false,
      });
    }, () => {
      this.setState({
        sendingText: false,
      });
    });
  }

  /**
   * @function call
   * @desc Requests for a phone call and updates the state with the result of the action
   * @private
   * @memberof Verify
   * @borrows accountApi.sendText
   */
  private call = () => {
    this.setState({
      callingPhone: true,
      callPhoneWaiting: true,
    });
    // TODO: Use callPhone method
    this.accountApi.callPhone({
      vid: this.props.params.vid,
    }).then(() => {
      this.setState({
        callingPhone: false,
      });
    }, () => {
      this.setState({
        callingPhone: false,
      });
    });
  }

  /**
   * @function handleResendWaitFinish
   * @desc Updates the state when the waiting time for an SMS finishes
   * @private
   * @memberof Verify
   */
  private handleResendWaitFinish = () => {
    this.setState({sendTextWaiting: false});
  }

  /**
   * @function handleCallWaitFinish
   * @desc Updates the state when the waiting time for a call finishes
   * @private
   * @memberof Verify
   */
  private handleCallWaitFinish = () => {
    this.setState({callPhoneWaiting: false});
  }

  /**
   * @function componentDidMount
   * @desc Creates an instance of AccountApi
   * @memberof Verify
   * @override
   */
  public componentDidMount() {
    /** define accountApi */
    this.accountApi = new AccountApi();
  }

  /**
   * (need doc)
   * @returns
   * @memberof Verify
   */
  public render() {
    return (
      <Form>
        <h2>Create an account</h2>
        <div className={[publicStyle.publicForm, style.verify].join(' ')}>
          <p className={publicStyle.formParagraph}>We've sent a verification code via SMS to
            &nbsp;<Link
              to={`/m/signup/phone/${this.props.params.country}/${this.props.params.code}/${this.props.params.phone}`}>
              {`+${this.props.params.code} ${this.props.params.phone}`}
            </Link>
            &nbsp;Check your phone and enter the code below:
          </p>
          <Form.Item
            validateStatus={this.state.validateStatus}
            help={this.state.validationMessage}
          >
            <label>Verification code</label>
            <Input className={style.verifyCode}
                   id="verificationCode"
                   value={this.state.verificationCode}
                   onChange={this.handleVerificationCodeChange}
            />
          </Form.Item>
          <div className={style.item}>
            <Waiting
              time={60}
              trigger={this.state.sendTextWaiting}
              onFinish={this.handleResendWaitFinish}
              message="wait...">
              <a onClick={this.resend} disabled={this.state.sendTextWaiting}>
                {this.state.sendingText ? 'Sending...' : 'Resend SMS'}
              </a>
            </Waiting>
          </div>
          <div className={style.item}>
            <Waiting
              time={180}
              trigger={this.state.callPhoneWaiting}
              onFinish={this.handleCallWaitFinish}
              message="wait...">
              <a onClick={this.call} disabled={this.state.callPhoneWaiting}>
                {this.state.callingPhone ? 'Calling...' : 'Request a Call'}
              </a>
            </Waiting>
          </div>
          <Button type="primary" style={{width: '100%'}} onClick={this.submit}>
            <b>Verify</b>
          </Button>
        </div>
      </Form>
    );
  }
}

export default Verify;
