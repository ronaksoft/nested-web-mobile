import * as React from 'react';
import Comment from './Comment';
import Demoted from './Demoted';
import Invite from './Invite';
import InviteRespond from './InviteRespond';
import YouJoined from './YouJoined';
import Mention from './Mention';
import NewSession from './NewSession';
import Promoted from './Promoted';
import PlaceSettingsChanged from './PlaceSettingsChanged';

import 'antd/dist/antd.css';
import INotification from '../../../../api/notification/interfaces/INotification';
import INotificationTypes from '../../../../api/notification/interfaces/INotificationTypes';

// const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class NotificationItem extends React.Component<IProps, any> {
  public render() {

    switch (this.props.notification.type) {
      case INotificationTypes.COMMENT:
        return (
          <div>
            {this.props.notification._id}
            <Comment notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.DEMOTED:
        return (
          <div>
            <Demoted notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.INVITE:
        return (
          <div>
            <Invite notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.INVITE_RESPOND:
        return (
          <div>
            <InviteRespond notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.YOU_JOINED:
        return (
          <div>
            <YouJoined notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.MENTION:
        return (
          <div>
            <Mention notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.NEW_SESSION:
        console.log(this.props.notification);
        return (
          <div>
            <NewSession notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.PROMOTED:
        return (
          <div>
            <Promoted notification={this.props.notification}/>
          </div>
        );
      case INotificationTypes.PLACE_SETTINGS_CHANGED:
        return (
          <div>
            <PlaceSettingsChanged notification={this.props.notification}/>
          </div>
        );
      default:
        return null;
    }
  }
}

export {NotificationItem}
