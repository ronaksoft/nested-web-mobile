import { Select } from 'antd';
const Option = Select.Option;
import Countries from '../Countries';
import './flags.png';
import './flags@2x.png';
const style = require('./style.css');
import * as React from 'react';
import ICountry from '../ICountry';

interface IProps {
  style?: {};
  selected: ICountry;
  onSelected: (country: ICountry) => void;
}

interface IState {
  selectedId?: string;
}

export default class CountrySelect extends React.Component<IProps, IState> {
  /**
   * Creates an instance of CountrySelect.
   * @param {IProps} props
   * @memberof CountrySelect
   */
  constructor(props: IProps) {
    super(props);

    this.state = {
      selectedId: props.selected ? props.selected.id : null,
    };
  }

  /**
   * Triggers props.onSelected with the selected country
   *
   * @private
   * @param {string} id
   * @memberof CountrySelect
   */
  private handleChange(id: string) {
    const item = Countries.find((country: ICountry) => country.id === id);
    if (item && this.props.onSelected) {
      this.props.onSelected(item);
    }
  };

  /**
   * Chose the selected country
   *
   * @param {IProps} nextProps
   * @returns
   * @memberof CountrySelect
   */
  public componentWillReceiveProps(nextProps: IProps) {
    if (!nextProps.selected) {
      return;
    }
    this.setState({
      selectedId: nextProps.selected.id,
    });
  }

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
        style={this.props.style}
        placeholder="Select your country"
        onChange={this.handleChange}
        value={this.state.selectedId}
      >
        {Countries.map(createCountry)}
      </Select>
    );
  }
}
