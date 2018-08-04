/**
 * @file component/PostBody/index.tsx
 * @auther naamesteh < naemabadei.shayesteh@gmail.com >
 * @desc This file renders the full name of accounts where we need it.
 * in this component we store accounts in redux. Component get requiered data directly from store or api call.
 * Document By : naamesteh
 * Date of documantion : 07/24/2017
 * Review by : robzizo
 * Date of review : 07/24/2017
 */
import * as React from 'react';
import {IcoN} from '../Icons';

const style = require('./submit.css');

interface IProps {
  disabled?: boolean;
  onClick?: (e: any) => void;
}

interface IState {
  /**
   * @property user
   * @desc Includes data of each Users
   * @type {object}
   * @memberof IState
   */
  disabled: boolean;
}

/**
 * @class FullName
 * @classdesc Component renders the FullName html element as an span
 * @extends {React.Component<IProps, IState>}
 */
class Submit extends React.Component<IProps, IState> {

  /**
   * Constructor
   * Creates an instance of FullName.
   * @param {IProps} props
   * @memberof FullName
   */
  constructor(props: any) {
    super(props);
    this.state = {
      disabled: props.disabled || false,
    };
  }

  public componentWillReceiveProps(props) {
    this.setState({
      disabled: props.disabled,
    });
  }

  /**
   * Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof FullName
   * @override
   */
  public componentDidMount() {
    console.log('');
  }

  private onClick = (e) => {
    this.props.onClick(e);
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof FullName
   * @generator
   */
  public render() {
    const classNames = [style.Submit];
    if (this.state.disabled) {
      classNames.push(style.Disabled);
    }
    return (
      <span className={classNames.join(' ')} onClick={this.onClick}>
        <IcoN size={16} name={'forwarded16'}/>
      </span>
    );
  }
}

export default Submit;
