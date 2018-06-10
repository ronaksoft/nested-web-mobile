import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import {ITaskActivity, IAttachment} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';
import Item from 'components/AttachmentUploader/Item';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class RemoveAttachment extends React.Component <IProps, any> {
  public render() {
    const activity = this.props.activity;
    return (
      <div className={[style.notifWrapper].join(' ')}>
        <UserAvatar user_id={activity.actor} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <b>
              <FullName user_id={activity.actor}/>
              <time className={style.time}> • {TimeUntiles.dynamic(activity.timestamp)}</time>
            </b>
            <aside>Removed a attachment:</aside>
            <div className={style.chipsWrapper}>
              {activity.attachments.map((attach: IAttachment) => (
                <Item
                  key={attach._id}
                  mode="task"
                  item={{model: attach}}
                  editable={false}
                />
              ))}
            </div>
          </div>
          <IcoN size={16} name={'attach16'}/>
        </div>
      </div>
    );
  }
}
