import * as React from 'react';
import {browserHistory} from 'react-router';
import {connect} from 'react-redux';
import {logout} from 'redux/app/actions';
import AccountApi from 'api/account';
import AAA from 'services/aaa';

interface IProps {
  isLogin: boolean;
  setLogout: () => {};
}

class Signout extends React.Component<IProps, {}> {
  private accountApi: AccountApi = new AccountApi();
  constructor(props: any) {
    super(props);

    this.state = {
      done: false,
    };
  }

  public componentWillReceiveProps(newProbs: IProps) {
    if (newProbs.isLogin) {
      AAA.getInstance().clearCredentials();
      browserHistory.push('/signin');
    }
  }

  public componentDidMount() {
    this.accountApi.logout().then(() => {
      this.props.setLogout();
    }, (error) => {
      console.log(error);
    });
  }

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

const mapStateToProps = (store) => ({
  isLogin: store.app.isLogin,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setLogout: () => {
      dispatch(logout());
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Signout);
