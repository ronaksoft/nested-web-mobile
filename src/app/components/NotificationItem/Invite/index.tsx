import * as React from 'react';
import INotification from '../INotification';
import 'antd/dist/antd.css';

// const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Invite extends React.Component <IProps, any> {
  public render() {
    return (
      <div>
        Invite notification
      </div>
    );
  }
}

export {Invite}
