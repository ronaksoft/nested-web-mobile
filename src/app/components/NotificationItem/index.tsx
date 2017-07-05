import * as React from 'react';
import {Comment} from './Comment';
import {Demoted} from './Demoted';
import {Invite} from './Invite';
import {InviteRespond} from './InviteRespond';
import {YouJoined} from './YouJoined';
import {Mention} from './Mention';
import {NewSession} from './NewSession';
import {Promoted} from './Promoted';
import {PlaceSettingsChanged} from './PlaceSettingsChanged';
import INotification from './INotification';
import 'antd/dist/antd.css';

// const style = require('../NotificationItem.css');

interface IProps {
  notification: INotification;
}

class NotificationItem extends React.Component<IProps, any> {
  public render() {
    if (this.props.notification.type === 'Comment') {
      return (
        <div>
          <Comment notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'Demoted') {
      return (
        <div>
          <Demoted notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'Invite') {
      return (
        <div>
          <Invite notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'InviteRespond') {
      return (
        <div>
          <InviteRespond notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'YouJoined') {
      return (
        <div>
          <YouJoined notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'Mention') {
      return (
        <div>
          <Mention notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'NewSession') {
      return (
        <div>
          <NewSession notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'Promoted') {
      return (
        <div>
          <Promoted notification={this.props.notification}/>
        </div>
      );
    } else if (this.props.notification.type === 'PlaceSettingsChanged') {
      return (
        <div>
          <PlaceSettingsChanged notification={this.props.notification}/>
        </div>
      );
    }
  }
}

export {NotificationItem}
