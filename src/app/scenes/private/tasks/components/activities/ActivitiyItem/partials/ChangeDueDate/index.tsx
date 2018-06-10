import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class ChangeDueDate extends React.Component <IProps, any> {
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
            <aside>Changed due date:</aside>
            <p>
              <time dateTime={TimeUntiles.Date(activity.due_date)}>{TimeUntiles.fullOnlyDate(activity.due_date)}</time>
              <br/>
              {activity.due_data_has_clock && (
                <time dateTime={TimeUntiles.Time(activity.due_date)}>{TimeUntiles.TimeParse(activity.due_date)}</time>
              )}
            </p>
          </div>
          <IcoN size={16} name={'finishFlag16'}/>
        </div>
      </a>
    );
  }
}
