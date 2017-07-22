import * as React from 'react';
import Comment from './Comment';
import Demoted from './Demoted';
import Invite from './Invite';
import InviteRespond from './InviteRespond';
import YouJoined from './YouJoined';
import Joined from './Joined';
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

interface IState {
  notification: INotification;
}

class NotificationItem extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      notification: this.props.notification,
    };
  }

  public componentDidMount() {
    this.setState({
      notification: this.props.notification,
    });
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      notification: newProps.notification,
    });
  }

  public render() {
    const notification = this.state.notification;
    switch (notification.type) {
      case INotificationTypes.COMMENT:
        return (
          <Comment notification={notification}/>
        );
      case INotificationTypes.DEMOTED:
        return (
          <Demoted notification={notification}/>
        );
      case INotificationTypes.INVITE:
        return (
          <Invite notification={notification}/>
        );
      case INotificationTypes.INVITE_RESPOND:
        return (
          <InviteRespond notification={notification}/>
        );
      case INotificationTypes.FRIEND_JOINED:
        return (
          <Joined notification={notification}/>
        );
      case INotificationTypes.YOU_JOINED:
        return (
          <YouJoined notification={notification}/>
        );
      case INotificationTypes.MENTION:
        return (
          <Mention notification={notification}/>
        );
      case INotificationTypes.NEW_SESSION:
        return (
          <NewSession notification={notification}/>
        );
      case INotificationTypes.PROMOTED:
        return (
          <Promoted notification={notification}/>
        );
      case INotificationTypes.PLACE_SETTINGS_CHANGED:
        return (
          <PlaceSettingsChanged notification={notification}/>
        );
      default:
        return null;
    }
  }
}

export {NotificationItem}
