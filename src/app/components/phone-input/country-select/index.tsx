import { Select } from 'antd';
const Option = Select.Option;
import Countries from './countries';
import './flags.png';
import './flags@2x.png';
const style = require('./style.css');
import * as React from 'react';
import 'antd/dist/antd.css';

interface IProps {
  style: {};
  autoLocate: boolean;
  onSelected: (country: ICountry) => void;
}

interface ICountry {
  id: any;
  text: any;
  code: any;
}

/**
 * A component that provides a list of countries
 *
 * @param {IProps} props
 * @returns
 */
const CountrySelect = (props: IProps) => {

  const items: ICountry[] = Countries.map((item) => {
    return {
      id: item[1],
      text: item[0],
      code: item[2],
    };
  });

  /**
   * Find the selected country and trigger onSelected
   *
   * @private
   * @param {string} id
   * @memberof CountrySelect
   */
  const handleChange = (id: string) => {
    const item = items.find((country: ICountry) => country.id === id);
    if (item && props.onSelected) {
      props.onSelected(item);
    }
  };

  /**
   * Create a country list-item component
   *
   * @param {ICountry} country
   * @returns
   */
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
      style={props.style}
      placeholder="Select your country"
      onChange={handleChange}
    >
      {items.map(createCountry)}
    </Select>
  );

};

export default CountrySelect;
