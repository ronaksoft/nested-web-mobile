import * as React from 'react';
import {Input} from 'antd';
const InputGroup = Input.Group;
import Countries from './Countries';
import ICountry from './ICountry';
import CountrySelect from './CountrySelect';

interface IProps {
  style?: {};
  autoLocate?: boolean;
  code?: string;
  phone?: string;
  onChange?: (country: string, code: string, phone: string) => void;
}

interface IState {
  country: ICountry;
  code: string;
  phone: string;
}

interface IGeoLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
}

const IP_LOCATION_URL = 'https://ipinfo.io/json';
const CODE_REGEX = /^[0-9]{0,4}$/;
const PHONE_REGEX = /^[0-9]{0,15}$/;

class PhoneInput extends React.Component<IProps, IState> {
  /**
   * Creates an instance of PhoneInput.
   * @param {IProps} props
   * @memberof PhoneInput
   */
  constructor(props: IProps) {
    super();
    this.state = {
      code: props.code,
      phone: props.phone,
      country: null,
    };

    if (props.autoLocate) {
      this.findGeoLocation().then((location: IGeoLocation) => {
        const country = this.getCountryById(location.country);
        this.setState({
          country,
          code: country.code,
         });
      });
    }

    this.handleCodeChange = this.handleCodeChange.bind(this);
    this.handlePhoneChange = this.handlePhoneChange.bind(this);
    this.handleCountrySelect = this.handleCountrySelect.bind(this);
  }

  /**
   * Listen to changes of country-code
   * and trigger onChange with the new country code and phone number
   *
   * @private
   * @param {*} e
   * @memberof PhoneInput
   */
  private handleCodeChange(e: any) {
    if (!CODE_REGEX.test(e.target.value)) {
      return;
    }

    this.setState({
      code: e.target.value,
    });

    if (this.props.onChange) {
      this.props.onChange(this.state.country.id, e.target.value, this.state.phone);
    }
  }

  /**
   * Listen to changes of phone
   * and trigger onChange with the new phone and country code
   *
   * @private
   * @param {*} e
   * @memberof PhoneInput
   */
  private handlePhoneChange(e: any) {
    if (!PHONE_REGEX.test(e.target.value)) {
      return;
    }
    this.setState({
      phone: e.target.value,
    });

    if (this.props.onChange) {
      this.props.onChange(this.state.country.id, this.state.code, e.target.value);
    }
  };

  /**
   * Find the user current location
   *
   * @private
   * @returns {Promise<IGeoLocation>}
   * @memberof PhoneInput
   */
  private findGeoLocation(): Promise<IGeoLocation> {
    return new Promise((resolve, reject) => {
      const req = new XMLHttpRequest();
      req.addEventListener('load', () => {
        resolve(JSON.parse(req.responseText));
      });
      req.addEventListener('error', reject);
      req.open('GET', IP_LOCATION_URL);
      req.send();
    });
  }

  private handleCountrySelect(country: ICountry) {
    if (this.state.code === country.code) {
      return;
    }

    this.setState({
      code: country.code,
      country,
    });

    if (this.props.onChange) {
      this.props.onChange(country.id, country.code, this.state.phone);
    }
  }

  /**
   * Find country code by countryId,
   * For example it returns '98' using 'IR'
   *
   * @private
   * @param {string} id
   * @returns {string}
   * @memberof PhoneInput
   */
  private getCountryById(id: string): ICountry {
    const matchIds = (first: string, second: string): boolean => {
      return first && second && first.toLowerCase() === second.toLowerCase();
    };

    return Countries.find((item: ICountry) => matchIds(item.id, id));
  }

  public render() {
    return (
      <div>
        <CountrySelect
                      onSelected={this.handleCountrySelect}
                      selected={this.state.country}
                      style={this.props.style || {}}
        />
        <br/>
        <InputGroup compact={true} style={this.props.style || {}}>
          <Input
                prefix="+"
                style={{ width: 64, borderLeft: 0 }}
                defaultValue={this.props.code}
                onChange={this.handleCodeChange}
                value={this.state.code}
          />
          <Input
                style={{ width: 'auto' }}
                defaultValue={this.props.phone}
                onChange={this.handlePhoneChange}
                value={this.state.phone}
          />
        </InputGroup>
      </div>
    );
  }
}

export default PhoneInput;
export {ICountry}
