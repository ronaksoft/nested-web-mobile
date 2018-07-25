import * as React from 'react';
import AccountApi from 'api/account/index';
import {connect} from 'react-redux';
import {IUser} from 'api/interfaces';
import {Scrollable, NstInput} from 'components';
import {userUpdate} from 'redux/app/actions';
import {message, Button} from 'antd';
import IValidationResult from '../../../public/IValidationResult';
import * as md5 from 'md5';

const style = require('./style.css');

/**
 * @interface IState
 */
interface IState {
  user: IUser;
  old: string;
  oldClassName: string;
  oldDescription: string;
  new: string;
  newClassName: string;
  newDescription: string;
  renew: string;
  renewClassName: string;
  renewDescription: string;
}

/**
 * @interface IProps
 */
interface IProps {
  location: any;
  user: any;
  userUpdate: (user: IUser) => {};
}

class Profile extends React.Component<IProps, IState> {

  private accountApi: AccountApi;

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
      old: '',
      oldClassName: '',
      oldDescription: '',
      new: '',
      newClassName: '',
      newDescription: '',
      renew: '',
      renewClassName: '',
      renewDescription: '',
    };
    this.accountApi = new AccountApi();
  }

  // public componentDidMount() {
  // }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      user: newProps.user,
    });
  }

  private validatePassword = (value?: string): IValidationResult => {
    if (!value) {
      return {
        status: 'error',
        message: 'Required',
      } as IValidationResult;
    }

    if (value.length < 6) {
      return {
        status: 'error',
        message: 'Password must be at least 6 character',
      } as IValidationResult;
    }

    if (value.length > 128) {
      return {
        status: 'error',
        message: 'Password is too long',
      } as IValidationResult;
    }

    return {
      status: 'success',
      message: null,
    } as IValidationResult;
  }

  private update = (field, value) => {
    // console.log(field, value);
    const state: any = {};
    state[field] = value;
    if (field === 'old') {
      const result = this.validatePassword(value);
      state.oldClassName = result.status;
      state.oldDescription = result.message;
    } else if (field === 'new') {
      const result = this.validatePassword(value);
      state.newClassName = result.status;
      state.newDescription = result.message;
    } else if (field === 'renew') {
      const result = this.validatePassword(value);
      state.renewClassName = result.status;
      state.renewDescription = result.message;
      if (value !== this.state.new) {
        state.renewClassName = 'error';
        state.renewDescription = 'Not match';
      }
    }
    this.setState(state);
  }

  private save = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (
      this.state.oldClassName === 'success' &&
      this.state.newClassName === 'success' &&
      this.state.renewClassName === 'success') {
        this.accountApi.setPassword(md5(this.state.old), md5(this.state.new)).then(() => {
          message.success('Your password is changed');
          this.setState({
            old: '',
            new: '',
            renew: '',
          });
        }).catch((e) => {
          if (e.code === 3) {
            message.error('Your have entered wrong old password');
          } else {
            message.error('Some problems happened');
          }
      });
    }
  }

  public render() {
    return (
      <Scrollable active={true}>
        <form className={style.password} onSubmit={this.save}>
          <NstInput label="Old Password" type="password" placeholder="Old Password" className={this.state.oldClassName}
            onChange={this.update.bind(this, 'old')} description={this.state.oldDescription} value=""/>
          <NstInput label="New Password" placeholder="New Password" className={this.state.newClassName}
            onChange={this.update.bind(this, 'new')} description={this.state.newDescription} value="" type="password"/>
          <NstInput label="Re-enter New Password" placeholder="Re-enter New Password"
            className={this.state.renewClassName} value="" type="password"
            onChange={this.update.bind(this, 'renew')} description={this.state.renewDescription}/>
          <Button
            type="primary"
            disabled={
              this.state.oldClassName !== 'success' ||
              this.state.newClassName !== 'success' ||
              this.state.renewClassName !== 'success'
            }
            htmlType="submit">Done</Button>
        </form>
      </Scrollable>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store) => ({
  user: store.app.user,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    userUpdate: (user: IUser) => {
      dispatch(userUpdate(user));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Profile);
