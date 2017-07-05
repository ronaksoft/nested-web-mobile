import * as React from 'react';
import INotification from '../INotification';
import 'antd/dist/antd.css';

// const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class Mention extends React.Component <IProps, any> {
  public render() {
    return (
      <div>
        Mention notification
      </div>
    );
  }
}

export {Mention}
