/**
 * @file components/PhoneInput/CountrySelect/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Country select component
 * @export PlaceApi
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-29
 * Reviewed by:           -
 * Date of review:        -
 */

import { Select } from 'antd';
const Option = Select.Option;
import Countries from '../Countries';
import './flags.png';
import './flags@2x.png';
const style = require('../phoneinput.css');
import * as React from 'react';
import ICountry from '../ICountry';

/**
 * @interface IProps
 * @desc The component properties
 *
 */
interface IProps {
  /**
   * @prop style
   * @desc Styles you wanna apply to the component
   * @type {{}}
   * @memberof IProps
   */
  style?: {};
  /**
   * @prop
   * @desc Sets the country as the selected item
   * @type {ICountry}
   * @memberof IProps
   */
  selected: ICountry;
  /**
   * @prop onSelected
   * @desc An event to trigger when a country has been selected
   * @memberof IProps
   */
  onSelected: (country: ICountry) => void;
}

interface IState {
  /**
   * @desc The selected country Id
   * @prop selectedId
   * @type {string}
   * @memberof IState
   */
  selectedId?: string;
}

/**
 * @class CountrySelect
 * @desc A component for selecting a country between all countries
 * @export
 * @extends {React.Component<IProps, IState>}
 */
export default class CountrySelect extends React.Component<IProps, IState> {
  /**
   * @desc Creates an instance of CountrySelect.
   * @param {IProps} props
   * @memberof CountrySelect
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedId: props.selected ? props.selected.id : null,
    };

    this.handleChange = this.handleChange.bind(this);
  }

  /**
   * @func handleChange
   * @desc Triggers props.onSelected with the selected country
   * @private
   * @param {string} id
   * @memberof CountrySelect
   */
  private handleChange(id: string) {
    const item = Countries.find((country: ICountry) => country.id === id);
    if (item && this.props.onSelected) {
      this.setState({
        selectedId: item.id,
      });
      this.props.onSelected(item);
    }
  };

  /**
   * @func filterCountry
   * @desc Filters countries by name
   * @private
   * @memberof CountrySelect
   */
  private filterCountry = (input: string, option: any) => {
    const name = option.props.children[1].toLowerCase();

    return name.indexOf(input.toLowerCase()) >= 0;
  }

  /**
   * @func componentWillReceiveProps
   * @desc Chose the selected country
   * @param {IProps} nextProps
   * @returns
   * @memberof CountrySelect
   */
  public componentWillReceiveProps(nextProps: IProps) {
    if (!nextProps.selected) {
      return;
    }

    this.setState({
      selectedId: nextProps.selected ? nextProps.selected.id : null,
    });

    if (this.props.onSelected) {
      this.props.onSelected(nextProps.selected);
    }
  }

  /**
   * @func render
   * @desc Renders the component
   * @memberof CountrySelect
   */
  public render() {
    const createCountry = (country: ICountry) => {
      return (
        <Option value={country.id} key={country.id}>
          <i className={style.flag + ' ' + style[country.id]} />
          {`${country.text} +${country.code}`}
        </Option>
      );
    };

    return (
      <Select
        showSearch={true}
        style={this.props.style}
        placeholder="Select your country"
        onChange={this.handleChange}
        value={this.state.selectedId}
        className={style.CountrySelect}
        filterOption={this.filterCountry}
      >
        {Countries.map(createCountry)}
      </Select>
    );
  }
}
