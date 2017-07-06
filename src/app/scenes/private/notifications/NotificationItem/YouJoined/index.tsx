import * as React from 'react';
import INotification from '../../../../../api/notification/interfaces/INotification';
import 'antd/dist/antd.css';

// const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class YouJoined extends React.Component <IProps, any> {
  public render() {
    return (
      <div>
        comment notification
      </div>
    );
  }
}

export default YouJoined;
