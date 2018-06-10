import * as React from 'react';
import {IcoN, UserAvatar, FullName, UserChips} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class RemoveWatcher extends React.Component <IProps, any> {
  public render() {
    const activity = this.props.activity;
    return (
      <a className={[style.notifWrapper].join(' ')}>
        <UserAvatar user_id={activity.actor} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <b>
              <FullName user_id={activity.actor}/>
              <time className={style.time}> • {TimeUntiles.dynamic(activity.timestamp)}</time>
            </b>
            {activity.watchers.length === 1 && <aside>Removed a watcher:</aside>}
            {activity.watchers.length > 1 && <aside>Removed watchers:</aside>}
            <div className={style.chipsWrapper}>
              {activity.watchers.map((user) => (
                <UserChips key={user._id} active={false} user={user} editable={false}/>
              ))}
            </div>
          </div>
          <IcoN size={16} name={'person16'}/>
        </div>
      </a>
    );
  }
}
