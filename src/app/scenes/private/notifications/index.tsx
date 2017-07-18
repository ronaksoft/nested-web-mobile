import * as React from 'react';
import {NotificationItem} from './NotificationItem';
import NotificationApi from '../../../api/notification/index';
import {INotificationData} from '../../../api/notification/interfaces/INotificationResponse';
import INotification from 'api/notification/interfaces/INotification';
import ArrayUntiles from 'services/utils/array';
import {connect} from 'react-redux';
import {setNotification} from '../../../redux/app/actions/index';
import {Button} from 'antd';
import {IcoN} from 'components';
const style = require('./notifications.css');
const privateStyle = require('../private.css');

// import PullRefresh from 'react-pullrefresh';

// custom renderer
// const renderWaitingComponent = () => {
//   return <div style={{backgroundColor: '#00f', color: '#fff'}}>waiting</div>;
// };
// const renderPullingComponent = (props, step) => {
//   return <div style={{backgroundColor: '#f00', color: '#fff'}}>{step + '/' + props.max}</div>;
// };
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
  // private startTouchPoint: number = 0;
  // private isInTop: boolean = true;
// setting initial states
  constructor(props) {
    super(props);
    this.handleRefresh = this.handleRefresh.bind(this);
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

  // public componentWillUnmount() {
  //   ;
  // }

  // private onSwipe(props: any, event: any) {
  //   console.log(event, props);
  //   if (event.direction === 8) {
  //     this.getNotificationAfter();
  //   } else if (event.direction === 16) {
  //     this.getNotificationBefore(false);
  //   }
  // }
  private handleRefresh(resolve) {
    // do some async code here
    resolve();
    this.getNotificationAfter();
  }

  // private onTouchStart() {
  //   if (window.scrollY === 0) {
  //     this.isInTop = true;
  //     const touch = arguments[1].touches[0];
  //     this.startTouchPoint = touch.clientY;
  //     console.log(touch.clientY);
  //   }
  // }

  // private onTouchEnd() {
  //   console.log(arguments[1].touches[0]);
  // }

  // private onTouchMove() {
  //   console.log(arguments[1].touches[0]);
  //   const touch = arguments[1].touches[0];
  //   const trasnlated = touch.clientY - this.startTouchPoint > 0 ? touch.clientY - this.startTouchPoint : 0;
  //   if ( trasnlated > 80 ) {
  //     return;
  //   }
  //   console.log(trasnlated);

  //   document.getElementById('scrollWrp').style.maxHeight = trasnlated + 'px';
  // }

  public render() {
    return (
      <div>
        <div className={style.notificationHead}>
          <h2>Notifications</h2>
          <a>
            <IcoN size={24} name="listCheck24"/>
          </a>
        </div>
        <div className={style.notificationWrp}>
          {this.state.notifications.map((notification) =>
            (<NotificationItem key={notification._id} notification={notification}/>))
          }
          <div className={privateStyle.loadMore}>
            <Button onClick={this.getNotificationBefore.bind(this, false)}>Load More</Button>
          </div>    
        </div>
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
