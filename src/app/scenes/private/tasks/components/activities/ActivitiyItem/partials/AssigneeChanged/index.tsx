import * as React from 'react';
import {IcoN, UserAvatar, FullName, UserChips} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class AssigneeChanged extends React.Component <IProps, any> {
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
            <aside>Changed the assignee:</aside>
            <div className={style.chipsWrapper}>
              <UserChips active={false} user={activity.assignee} editable={false}/>
            </div>
          </div>
          <IcoN size={16} name={'person16'}/>
        </div>
      </a>
    );
  }
}
