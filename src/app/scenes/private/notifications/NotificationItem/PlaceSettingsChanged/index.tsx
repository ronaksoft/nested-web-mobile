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
            <img/>
          </div>
        </div>
        <div>
          <div>
            <p>
              changed the settings of.
            </p>
          </div>
          <svg/>
        </div>
      </div>
    );
  }
}

export default PlaceSettingsChanged;
