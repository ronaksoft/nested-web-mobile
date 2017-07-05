import * as React from 'react';
import {NotificationItem} from 'components/NotificationItem';
import 'antd/dist/antd.css';
import INotification from '../../../components/NotificationItem/INotification';

interface IState {
  items: any[];
}

class Notifications extends React.Component<{}, IState> {
// setting initial states
  constructor(props: {}) {
    super(props);
    this.state = {
      items: [],
    };
  }

  public render() {
    const notificationTypes: INotification[] = [
      {
        id: 'COMMENT',
        type: 'Comment',
      },
      {
        id: 'DEMOTED',
        type: 'Demoted',
      },
      {
        id: 'INVITE',
        type: 'Invite',
      },
      {
        id: 'INVITERESPOND',
        type: 'InviteRespond',
      },
      {
        id: 'YOUJOINED',
        type: 'YouJoined',
      },
      {
        id: 'MENTION',
        type: 'Mention',
      },
      {
        id: 'NEWSESSION',
        type: 'NewSession',
      },
      {
        id: 'PROMOTED',
        type: 'Promoted',
      },
      {
        id: 'PLACESETTINGSCHANGED',
        type: 'PlaceSettingsChanged',
      },
    ];
    return (
      <div>
        {notificationTypes.map((notification) =>
          (<NotificationItem key={notification.id} notification={notification}/>))}
      </div>
    );
  }
}

export {Notifications}
