import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class UnoneTodo extends React.Component <IProps, any> {
  public render() {
    const activity = this.props.activity;
    console.log(activity);
    return (
      <a className={[style.notifWrapper].join(' ')}>
        <UserAvatar user_id={activity.actor} size={32} borderRadius={'16px'}/>
        <div className={style.notifContainer}>
          <div className={style.notifData}>
            <b>
              <FullName user_id={activity.actor}/>
              <time className={style.time}> • {TimeUntiles.dynamic(activity.timestamp)}</time>
            </b>
            <aside>Marked a to-do task as done:</aside>
            <p>“{activity.todo_text}”</p>
          </div>
          <IcoN size={16} name={'person16'}/>
        </div>
      </a>
    );
  }
}
