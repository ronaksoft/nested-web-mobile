import * as React from 'react';
import { OptionsMenu } from 'components';
import {connect} from 'react-redux';
import {setNotification} from '../../../redux/app/actions/index';
import INotification from '../../../api/notification/interfaces/INotification';

class Posts extends React.Component<any, any> {
  public render() {
    return (
      <div>
        <OptionsMenu />

      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  notifications: store.app.notifications,
  notificationsCount: store.app.notificationsCount,
});

const mapDispatchToProps = (dispatch) => {
  return {
    setNotification: (notifications: INotification[]) => {
      dispatch(setNotification(notifications));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Posts);
