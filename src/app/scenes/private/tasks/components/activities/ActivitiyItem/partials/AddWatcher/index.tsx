import * as React from 'react';
import {IcoN, UserAvatar, FullName, UserChips} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class AddWatcher extends React.Component <IProps, any> {
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
            {activity.watchers.length === 1 && <aside>Added a watcher:</aside>}
            {activity.watchers.length > 1 && <aside>Added watchers:</aside>}
            <div className={style.chipsWrapper}>
              {activity.watchers.map((user) => (
                <UserChips key={user._id} active={false} user={user} editable={false}/>
              ))}
            </div>
          </div>
          <div className={style.green}>
            <IcoN size={16} name={'eyeOpen16'}/>
          </div>
        </div>
      </a>
    );
  }
}
