import * as React from 'react';
// import {UserAvatar} from '../../../../../components/userAvatar';
// import IUser from '../../../../../api/account/interfaces/IUser';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
  // user: IUser;
}

class Mention extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
            <a>
              {this.props.notification.account_id}
            </a>
            <p>
              {this.props.notification.place_id}
              {new Date(this.props.notification.timestamp).toString()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default Mention;
