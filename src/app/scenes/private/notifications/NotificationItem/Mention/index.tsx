import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Mention extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
            <img/>
          </div>
        </div>
        <div>
          <div>
            <p>
              <a>
                {this.props.notification.account_id}
              </a>
              <br/>
              <span>
                {this.props.notification.actor_id}
                </span>
            </p>
            <p>
              {this.props.notification.comment_id}
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

export default Mention;
