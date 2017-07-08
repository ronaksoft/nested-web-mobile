import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Promoted extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
              <p>
                <b>
                  {this.props.notification.account_id}
                </b>
                promoted you in
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
    );
  }
}

export default Promoted;
