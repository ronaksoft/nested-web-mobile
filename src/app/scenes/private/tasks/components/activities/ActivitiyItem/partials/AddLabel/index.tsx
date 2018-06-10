import * as React from 'react';
import {IcoN, UserAvatar, FullName, LabelChips} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class AddLabel extends React.Component <IProps, any> {
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
            {activity.labels.length === 1 && <aside>Added a label:</aside>}
            {activity.labels.length > 1 && <aside>Added labels:</aside>}
            <div className={style.chipsWrapper}>
              {activity.labels.map((label) => (
                <LabelChips key={label._id} label={label}/>
              ))}
            </div>
          </div>
          <IcoN size={16} name={'person16'}/>
        </div>
      </a>
    );
  }
}
