import * as React from 'react';
import {NotificationItem} from './NotificationItem';
import NotificationApi from '../../../api/notification/index';
import {INotificationData} from '../../../api/notification/interfaces/INotificationResponse';
import INotification from 'api/notification/interfaces/INotification';
import ArrayUntiles from 'services/utils/array';
import {connect} from 'react-redux';
import {setNotification} from '../../../redux/app/actions/index';
import {Button} from 'antd';

interface IState {
  notifications: INotification[];
  skip: number;
  limit: number;
}

interface IProps {
  setNotification: (notifications: INotification[]) => {};
  notifications: INotification[];
  notificationsCount: number;
}

class Notifications extends React.Component<IProps, IState> {
// setting initial states
  constructor(props) {
    super(props);
    this.state = {
      notifications: this.props.notifications,
      limit: 10,
      skip: 0,
    };
  }

  private getNotification() {
    const notificationApi = new NotificationApi();
    notificationApi.get({
      skip: this.state.skip,
      limit: this.state.limit,
    }).then((notificationsResponse: INotificationData) => {
      if (this.state.skip === 0) {
        this.props.setNotification(notificationsResponse.notifications);
      }
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(this.state.notifications), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      this.setState({
        notifications: notifs,
        skip: notifs.length,
      });
    });
  }

  public componentDidMount() {
    this.getNotification();
  }

  public render() {
    return (
      <div>
        {this.state.notifications.length}
        {this.state.notifications.map((notification) =>
          (<NotificationItem key={notification._id} notification={notification}/>))
        }
        <Button onClick={this.getNotification.bind(this, '')}>More..</Button>
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

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
