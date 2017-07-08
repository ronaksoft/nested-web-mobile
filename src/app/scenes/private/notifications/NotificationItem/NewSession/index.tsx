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
              <b>
                {this.props.notification._cid.replace(/_/g, ' ')}
                {new Date(this.props.notification.timestamp).toString()}
              </b>
            </p>
          </div>
        </div>
      </div>
    );
  }
}

export default NewSession;
