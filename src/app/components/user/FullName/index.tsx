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
import IUser from '../../../api/account/interfaces/IUser';
import {accountAdd} from '../../../redux/accounts/actions/index';
import AccountApi from '../../../api/account/index';
import {connect} from 'react-redux';

interface IOwnProps {
  /**
   * @property user_id
   * @desc Includes user_id of users
   * @type {string}
   * @memberof IOwnProps
   */
  user_id: string;
}

interface IUserItemProps {
  /**
   * @property user_id
   * @desc Includes user_id of users
   * @type {string}
   * @memberof IUserItemProps
   */
  user_id: string;
  /**
   * @property accounts
   * @desc Includes array of IUser's objects
   * @type {array}
   * @memberof IUserItemProps
   */
  accounts: IUser[];
  /**
   * @property accountAdd
   * @desc Includes account add function
   * @type {function}
   * @memberof IUserItemProps
   */
  accountAdd: (user: IUser) => {};
}

interface IState {
  /**
   * @property user
   * @desc Includes data of each Users
   * @type {object}
   * @memberof IState
   */
  user: IUser | null;
}

/**
 * @class FullName
 * @classdesc Component renders the FullName html element as an span
 * @extends {React.Component<IProps, IState>}
 */
class FullName extends React.Component<IUserItemProps, IState> {

  /**
   * Constructor
   * Creates an instance of FullName.
   * @param {IProps} props
   * @memberof FullName
   */
  constructor(props: any) {
    super(props);
    /**
     * read the data from props and set to the state and
     * setting initial state
     * @type {object}
     */
    this.state = {
      user: null,
    };
  }

  /**
   * Get post from redux store
   * Calls the Api and store it in redux store
   * @func componentDidMount
   * @memberof FullName
   * @override
   */
  public componentDidMount() {
    /**
     * search redux store for any user which has the same id with `user_id`
     */
    const user = this.props.accounts.filter((user: IUser) => {
      return user._id === this.props.user_id;
    });
    /**
     * determine user is stored in redux already
     */
    if (user.length > 0) {
      this.setState({
        user: user[0],
      });
    } else {
      /**
       * define the account Api
       */
      const accountApi = new AccountApi();
      /**
       * Get account fro `accountApi` with declared `account_id`
       */
      accountApi.get({account_id: this.props.user_id})
        .then((account: IUser) => {
          this.setState({
            user: account,
          });
          /**
           * store account in redux store
           */
          this.props.accountAdd(account);
        });
    }

  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof FullName
   * @generator
   */
  public render() {

    const {user} = this.state;

    if (!user) {
      return null;
    }
    return (
      <span>{user.fname}&nbsp;{user.lname}</span>
    );
  }
}

/**
 * redux store mapper
 * @param store
 * @param ownProps
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  accounts: store.accounts.accounts,
  user_id: ownProps.user_id,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchAction = (dispatch) => {
  return {
    accountAdd: (account: IUser) => dispatch(accountAdd(account)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(FullName);
