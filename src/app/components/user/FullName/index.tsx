import * as React from 'react';
import IUser from '../../../api/account/interfaces/IUser';
import {accountAdd} from '../../../redux/accounts/actions/index';
import AccountApi from '../../../api/account/index';
import {connect} from 'react-redux';

interface IOwnProps {
  user_id: string;
}

interface IUserItemProps {
  user_id: string;
  accounts: IUser[];
  accountAdd: (user: IUser) => {};
}

interface IState {
  user: IUser | null;
}

class FullName extends React.Component<IUserItemProps, IState> {
  constructor(props: any) {
    super(props);
    this.state = {
      user: null,
    };
  }

  public componentDidMount() {
    const user = this.props.accounts.filter((user: IUser) => {
      return user._id === this.props.user_id;
    });

    if (user.length > 0) {
      this.setState({
        user: user[0],
      });
    } else {
      const accountApi = new AccountApi();
      accountApi.get({account_id: this.props.user_id})
        .then((account: IUser) => {
          this.setState({
            user: account,
          });
          this.props.accountAdd(account);
        });
    }

  }

  public render() {

    const {user} = this.state;

    if (!user) {
      return null;
    }
    return (
      <span>{user.fname} {user.lname}</span>
    );
  }
}

const mapStateToProps = (store, ownProps: IOwnProps) => ({
  accounts: store.accounts.accounts,
  user_id: ownProps.user_id,
});

const mapDispatchAction = (dispatch) => {
  return {
    accountAdd: (account: IUser) => dispatch(accountAdd(account)),
  };
};

export default connect(mapStateToProps, mapDispatchAction)(FullName);
