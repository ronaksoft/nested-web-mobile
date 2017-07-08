import * as React from 'react';

import 'antd/dist/antd.css';
import INotification from '../../../../../api/notification/interfaces/INotification';

const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class PlaceSettingsChanged extends React.Component <IProps, any> {
  public render() {
    return (
      <div className={style.mention}>
        <div>
          <div>
              <p>
                <b>
                  {this.props.notification.account_id}
                </b>
                changed the settings of
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

export default PlaceSettingsChanged;
