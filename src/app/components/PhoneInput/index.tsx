/**
 * @file components/PhoneInput/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc A component that is designed to select your country and enter your phone number.
 * @export PhoneInput
 * @exports {ICountry}
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-29
 * Reviewed by:           -
 * Date of review:        -
 */
import * as React from 'react';
import {Input} from 'antd';
const InputGroup = Input.Group;
import Countries from './Countries';
import ICountry from './ICountry';
import CountrySelect from './CountrySelect';
const style = require('./phoneinput.css');

/**
 * @interface IProps
 * @desc Properties of the component
 */
interface IProps {
  /**
   * @prop style
   * @desc The styles that you want to be applied to the component
   * @type {{}}
   * @memberof IProps
   */
  style?: {};
  /**
   * @prop autoLocate
   * @desc A flag that enables auto locate faeture. By enabling this, The component
   * finds your country and phone number prefix automatically
   * @type {boolean}
   * @memberof IProps
   */
  autoLocate?: boolean;
  /**
   * @prop country
   * @desc A country Id to be selected
   * @type {string}
   * @memberof IProps
   */
  country?: string;
  /**
   * @prop code
   * @desc A country code to be set in country-code input
   * @type {string}
   * @memberof IProps
   */
  code?: string;
  /**
   * @prop phone
   * @desc A phone number to be set in phone input
   * @type {string}
   * @memberof IProps
   */
  phone?: string;
  /**
   * @prop onChange
   * @desc An event that will be triggered when country, code or phone changes
   * @memberof IProps
   */
  onChange?: (country: string, code: string, phone: string) => void;
}

/**
 * The component state
 *
 * @interface IState
 */
interface IState {
  /**
   * @prop country
   * @desc The selected country
   * @type {ICountry}
   * @memberof IState
   */
  country: ICountry;
  /**
   * @prop code
   * @desc The selected country code
   * @type {string}
   * @memberof IState
   */
  code: string;
  /**
   * @prop phone
   * @desc The selected phone number
   * @type {string}
   * @memberof IState
   */
  phone: string;
}

/**
 * @interface IGeoLocation
 * @desc Interface of ipinfo.io response
 */
interface IGeoLocation {
  ip: string;
  city: string;
  region: string;
  country: string;
  loc: string;
  org: string;
}
/**
 * @const IP_LOCATION_URL
 * @desc Url of geolocation finder service
 */
const IP_LOCATION_URL = 'https://ipinfo.io/json';
/**
 * @const CODE_REGEX
 * @desc A regex that validates country-code
 */
const CODE_REGEX = /^[0-9]{0,4}$/;
/**
 * @const PHONE_REGEX
 * @desc A regex that validates phone-number
 */
const PHONE_REGEX = /^[0-9]{0,15}$/;

/**
 * @class PhoneInput
 * @desc Choose your country and input your phone number using this component easily.
 * @extends {React.Component<IProps, IState>}
 */
class PhoneInput extends React.Component<IProps, IState> {
  /**
   * Creates an instance of PhoneInput.
   * @param {IProps} props
   * @memberof PhoneInput
   */
  constructor(props: IProps) {
    super();
    let country = null;

    // Finds a country by country Id which is provided through props
    if (props.country) {
      country = this.getCountryById(props.country);
    }

    this.state = {
      code: props.code,
      phone: props.phone,
      country,
    };

    // Finds the client location and country code
    if (props.autoLocate && !props.country) {
      this.findGeoLocation().then((location: IGeoLocation) => {
        const country = this.getCountryById(location.country);
        if (country && country.id) {
          this.setState({
            country,
            code: country.code,
          });
        }
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

    const country = this.getCountryByCode(e.target.value);

    this.setState({
      code: e.target.value,
      country,
    });

    if (this.props.onChange) {
      const countryId = country && country.id ? country.id : null;
      this.props.onChange(countryId, e.target.value, this.state.phone);
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
      const country = this.state.country ? this.state.country.id : null;
      this.props.onChange(country, this.state.code, e.target.value);
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
    if (process.env.BROWSER) {
      return new Promise((resolve, reject) => {
        const req = new XMLHttpRequest();
        req.addEventListener('load', () => {
          resolve(JSON.parse(req.responseText));
        });
        req.addEventListener('error', reject);
        req.open('GET', IP_LOCATION_URL);
        req.send();
      });
    } else {
      return Promise.resolve(null);
    }
  }

  /**
   * Updates the state with the selected country
   *
   * @private
   * @param {ICountry} country
   * @returns
   * @memberof PhoneInput
   */
  private handleCountrySelect(country: ICountry) {
    if (!country) {
      return;
    }

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

  /**
   * Finds a country using the provided code
   *
   * @private
   * @param {string} code
   * @returns {ICountry}
   * @memberof PhoneInput
   */
  private getCountryByCode(code: string): ICountry {
    return Countries.find((item: ICountry) => item.code === code);
  }

  /**
   * Renders the component
   *
   * @memberof PhoneInput
   */
  public render() {
    return (
      <div>
        <label>Country</label>
        <CountrySelect
                      onSelected={this.handleCountrySelect}
                      selected={this.state.country}
                      style={this.props.style || {}}
        />
        <label>Phone Number</label>
        <InputGroup className={style.phoneNumber} compact={true} style={this.props.style || {}}>
          <Input
                type="tel"
                name="country-code"
                prefix="+"
                style={{ width: 64, borderLeft: 0 }}
                onChange={this.handleCodeChange}
                value={this.state.code}
          />
          <Input
                type="tel" name="phone"
                style={{ width: '100%' }}
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
