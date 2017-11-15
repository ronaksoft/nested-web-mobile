/**
 * @file component/Signout/index.tsx
 * @author - < - >
 * @description clears user session and redirecting to the sign in page
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-31
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {hashHistory} from 'react-router';
import {connect} from 'react-redux';
import {logout} from 'redux/app/actions';
import AccountApi from 'api/account';
import AAA from 'services/aaa';

/**
 * @name IProps
 * @interface ISidebarProps for sidebar initials data
 * This interface pass the required parameters for sidebar.
 * @type {object}
 * @property {boolean} isLogin - is login flag
 * @property {function} setLogout - Notifies parent about the signout event
 */
interface IProps {
  isLogin: boolean;
  setLogout: () => {};
}

class Signout extends React.Component<IProps, {}> {

  /**
   * @name AccountApi
   * @desc define and assign accountApi
   * @private
   * @memberof Signout
   */
  private accountApi: AccountApi = new AccountApi();

  /**
   * Creates an instance of Signout.
   * @param {IProps} props
   * @memberof Signout
   */
  constructor(props: any) {
    super(props);

    /**
     * @default this.state
     * @type {any}
     */
    this.state = {
      done: false,
    };
  }

  /**
   * Redirect to /signin the user was logged out successfully
   *
   * @param {IProps} newProbs
   * @memberof Signout
   */
  public componentWillReceiveProps(newProbs: IProps) {
    if (newProbs.isLogin === false) {
      AAA.getInstance().clearCredentials();
      hashHistory.push('/m/signin');
      window.location.reload();
    }
  }

  /**
   * Log out the user on mount
   * @public
   * @memberof Signout
   */
  public componentDidMount() {
    this.accountApi.logout().then(() => {
      this.props.setLogout();
    }, (error) => {
      console.log(error);
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof Signout
   * @override
   * @generator
   */
  public render() {
    return (
      <div>
        <p style={{textAlign: 'center'}}>
          Please wait...
        </p>
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param {any} redux store
 * @returns store item object
 */
const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
});

/**
 * reducer actions functions mapper
 * @param {any} dispatch reducer dispacther
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signout);
