
import * as React from 'react';

const style = require('../taskViewItem.css');
import {TaskIcon} from 'components';

import TimeUntiles from '../../../../../../services/utils/time';
import ITask from '../../../../../../api/task/interfaces/ITask';
import statuses from '../../../../../../api/consts/CTaskProgressTask';
import CTaskStatus from '../../../../../../api/consts/CTaskStatus';

interface IProps {
  task: ITask;
  onClick?: () => void;
}

interface IState {
  task: ITask;
  onClick: () => void;
}

export default class TaskOverDueView extends React.Component<IProps, IState> {

  constructor(props: any) {
    super(props);
    this.state = {
        task: this.props.task,
        onClick: this.props.onClick,
    };
  }

  public componentWillReceiveProps(newProps: IProps) {

    this.setState({
        task: newProps.task,
    });
  }

  public render() {
    const {task} = this.state;
    let progress = 0;
    if (task.todos) {

      const total = task.todos.length;
      let done = 0;
      task.todos.forEach((todo) => {
        if (todo.done) {
          done++;
        }
      });

      if (total > 0) {
        progress = Math.ceil((done / total) * 100);
      }
    }
    let taskStatus: string = '';
    switch (task.status) {
      default:
      case CTaskStatus.NO_ASSIGNED:
        taskStatus = statuses.NOT_ASSIGNED;
        break;
      case CTaskStatus.ASSIGNED:
        if (progress < 0) {
          taskStatus =  statuses.ASSIGNED_NO_CHECKLIST;
          break;
        } else if (progress === 0) {
          taskStatus =  statuses.ASSIGNED_CHECKLIST;
          break;
        } else {
          taskStatus =  statuses.ASSIGNED_PROGRESS;
          break;
        }
      case CTaskStatus.CANCELED:
        taskStatus =  statuses.CANCELED;
        break;
      case CTaskStatus.REJECTED:
        taskStatus =  statuses.REJECTED;
        break;
      case CTaskStatus.COMPLETED:
        taskStatus =  statuses.COMPLETED;
        break;
      case CTaskStatus.HOLD:
        taskStatus =  statuses.HOLD;
        break;
      case CTaskStatus.OVERDUE:
        taskStatus =  statuses.OVERDUE;
        break;
      case CTaskStatus.FAILED:
        taskStatus =  statuses.FAILED;
        break;
    }
    return (
      <div className={style.overDueItem + ' ' + style.taskItem}>
        <div className={style.taskItemInner}>
          <TaskIcon status={taskStatus} progress={progress}/>
          <div className={style.taskContent}>
            <div className={style.taskHead}>
              <h4>{task.title}</h4>
              <span>{TimeUntiles.dynamic(task.due_date)}</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
