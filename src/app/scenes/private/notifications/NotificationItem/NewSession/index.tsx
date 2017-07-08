import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class NewSession extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
            <p>
              <small>You logged in from:</small>
            </p>
            <p>
              {this.props.notification._cid.replace(/_/g, ' ')}
            </p>
          </div>
          <div>
            {new Date(this.props.notification.timestamp).toString()}
          </div>
        </div>
      </div>
    );
  }
}

export default NewSession;
