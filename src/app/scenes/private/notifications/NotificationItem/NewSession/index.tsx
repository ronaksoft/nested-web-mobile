import * as React from 'react';
import {UserAvatar} from '../../../../../components/userAvatar';
import IUser from '../../../../../api/account/interfaces/IUser';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
  user: IUser;
}

class NewSession extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
            <UserAvatar user={this.props.user} size="48" borderRadius="48"/>
          </div>
          <div>
            <p>
              <small><b>New login</b> from:</small>
              {this.props.notification._cid.replace(/_/g, ' ')}
              {new Date(this.props.notification.timestamp).toString()}
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default NewSession;
