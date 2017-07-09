import * as React from 'react';
import {browserHistory} from 'react-router';
import PhoneInput from 'components/PhoneInput';
import {Button} from 'antd';
import AccountApi from 'api/account';

class Phone extends React.Component<any, any> {
  private phone: string;
  private country: string;
  private code: string;
  private accountApi: AccountApi;

  constructor() {
    super();

    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  private handlePhoneChange(country: string, code: string, phone: string) {
    this.country = country;
    this.code = code;
    this.phone = phone;
  }

  private submit() {
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
        <p>To create an account with Nested, please enter your phone number.</p>
        <PhoneInput
                    onChange={this.handlePhoneChange}
                    autoLocate={true}
                    style={{width: '100%'}}
                    code={this.props.params.code}
                    phone={this.props.params.phone}
                    country={this.props.params.country}/>
        <Button type="primary" style={{width: '100%'}} onClick={this.submit}>
          <b>Next</b>
        </Button>
      </div>
    );
  }
}

export default Phone;
