import * as React from 'react';
import {NotificationItem} from './NotificationItem';
import NotificationApi from '../../../api/notification/index';
import {INotificationData} from '../../../api/notification/interfaces/INotificationResponse';
import INotification from 'api/notification/interfaces/INotification';
import ArrayUntiles from 'services/utils/array';
import {connect} from 'react-redux';
import {setNotification} from '../../../redux/app/actions/index';
import {Button} from 'antd';
import * as Hammer from 'react-hammerjs';

interface IState {
  notifications: INotification[];
}

interface IProps {
  setNotification: (notifications: INotification[]) => {};
  notifications: INotification[];
  notificationsCount: number;
}

class Notifications extends React.Component<IProps, IState> {
  private requestLimit: number = 20;

// setting initial states
  constructor(props) {
    super(props);
    this.state = {
      notifications: this.props.notifications,
    };
  }

  private getNotificationBefore(saveInStore: boolean) {
    const notificationApi = new NotificationApi();
    notificationApi.get({
      limit: this.requestLimit,
      before: (this.state.notifications.length > 0) ?
        this.state.notifications[this.state.notifications.length - 1].timestamp : Date.now(),
    }).then((notificationsResponse: INotificationData) => {
      if (saveInStore) {
        this.props.setNotification(notificationsResponse.notifications);
      }
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(this.state.notifications), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      this.setState({
        notifications: notifs,
      });
    });
  }

  private getNotificationAfter() {
    const notificationApi = new NotificationApi();
    notificationApi.get({
      limit: this.requestLimit,
      after: this.state.notifications[0].timestamp,
    }).then((notificationsResponse: INotificationData) => {
      if (notificationsResponse.notifications.length > 0) {
        this.props.setNotification(notificationsResponse.notifications);
      }
      const notifs =
        ArrayUntiles.uniqueObjects(notificationsResponse.notifications.concat(this.state.notifications), '_id')
          .sort((a: INotification, b: INotification) => {
            return b.timestamp - a.timestamp;
          });

      this.setState({
        notifications: notifs,
      });
    });
  }

  public componentDidMount() {
    this.getNotificationBefore(true);
  }

  private onSwipe(event: any) {
    if (event.direction === 1) {
      this.getNotificationAfter();
    } else if (event.direction === 3) {
      this.getNotificationBefore(false);
    }
  }

  public render() {
    return (
      <div>
        <Hammer onSwipe={this.onSwipe.bind(this)} options={{
          preventDefault: true,
        }}>
          <div>
            {this.state.notifications.length}
            {this.state.notifications.map((notification) =>
              (<NotificationItem key={notification._id} notification={notification}/>))
            }

            <Button onClick={this.getNotificationBefore.bind(this, false)}>More..</Button>
          </div>
        </Hammer>
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
