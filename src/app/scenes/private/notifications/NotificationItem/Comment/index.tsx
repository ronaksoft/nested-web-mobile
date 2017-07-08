import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Comment extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
            <div>
              <p>
                <a>
                  {this.props.notification.account_id}
                </a>
                <small>
                  commented on your post
                </small>
                <b>
                  {this.props.notification.place_id}
                </b>.
              </p>
            </div>
            <div>
              {new Date(this.props.notification.timestamp).toString()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Comment;
