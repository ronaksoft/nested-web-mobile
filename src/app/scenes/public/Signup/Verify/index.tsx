import * as React from 'react';
import {browserHistory, Link} from 'react-router';
import {Input, Button, message, Form} from 'antd';
import AccountApi from 'api/account';
import Waiting from './Waiting';
import ValidationStatus from '../ValidationStatus';
import IValidationResult from '../IValidationResult';
const style = require('./verify.css');
const publicStyle = require('../../public.css');

interface IParams {
  country: string;
  code: string;
  phone: string;
  vid: string;
}

interface IState {
  verificationCode: string;
  sendingText: boolean;
  callingPhone: boolean;
  sendTextWaiting: boolean;
  callPhoneWaiting: boolean;
  validateStatus?: ValidationStatus;
  validationMessage?: string;
}

interface IProps {
  params: IParams;
}

const CODE_REGEX = /^[0-9]{6}$/;
class Verify extends React.Component<IProps, IState> {
  private accountApi: AccountApi;
  constructor(props: any) {
    super(props);

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

  private handleVerificationCodeChange = (e: any) => {
    const validationResult = this.validateVerificationCode(e.target.value);
    this.setState({
      verificationCode: e.target.value,
      validateStatus: validationResult.status,
      validationMessage: validationResult.message,
    });
  }

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

  private submit = () => {
    if (!this.validate()) {
      return;
    }
    this.accountApi.verifyCode({
      code: this.state.verificationCode,
      vid: this.props.params.vid,
    }).then(() => {
      const nextStepRoute = '/signup/register/:country/:code/:phone/:vid'
        .replace(':country', this.props.params.country)
        .replace(':code', this.props.params.code)
        .replace(':phone', this.props.params.phone)
        .replace(':vid', this.props.params.vid);

      browserHistory.push(nextStepRoute);
    }, () => {
      message.error('An error has occured in verifying your phone');
    });
  }

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

  private call = () => {
    this.setState({
      callingPhone: true,
      callPhoneWaiting: true,
    });

    this.accountApi.sendText({
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

  private handleResendWaitFinish = () => {
    this.setState({ sendTextWaiting: false });
  }

  private handleCallWaitFinish = () => {
    this.setState({ callPhoneWaiting: false });
  }

  public componentDidMount() {
    this.accountApi = new AccountApi();
  }

  public render() {
    return (
      <Form>
        <h2>Create an account</h2>
        <div className={publicStyle.publicForm}>
          <p className={publicStyle.formParagraph}>We've sent a verification code via SMS to
            &nbsp;<Link
                to={`/signup/phone/${this.props.params.country}/${this.props.params.code}/${this.props.params.phone}`}>
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
          <div>
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
          <div>
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
