import * as React from 'react';
import {IcoN, UserAvatar, FullName} from 'components';
import {ITaskActivity} from 'api/interfaces/';
import TimeUntiles from 'services/utils/time';
import C_TASK_STATUS from 'api/consts/CTaskStatus';

const style = require('../../ActivityItem.css');

interface IProps {
  activity: ITaskActivity;
}

export default class ChangeStatus extends React.Component <IProps, any> {
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
            <aside>Changed the Status:</aside>
            <p>
              {activity.status === C_TASK_STATUS.NO_ASSIGNED && 'Not Assigned'}
              {activity.status === C_TASK_STATUS.ASSIGNED && 'Assigned'}
              {activity.status === C_TASK_STATUS.CANCELED && 'Canceled'}
              {activity.status === C_TASK_STATUS.REJECTED && 'Rejected'}
              {activity.status === C_TASK_STATUS.COMPLETED && 'Completed'}
              {activity.status === C_TASK_STATUS.HOLD && 'Hold'}
              {activity.status === C_TASK_STATUS.OVERDUE && 'Overdue'}
              {activity.status === C_TASK_STATUS.FAILED && 'Failed'}
            </p>
          </div>
          <IcoN size={16} name={'taskInProgress16'}/>
        </div>
      </a>
    );
  }
}
