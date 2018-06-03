
import * as React from 'react';

const style = require('../taskViewItem.css');
import {TaskIcon, FullName} from 'components';
import {C_TASK_RESPONSE} from '../../../../../../api/task/consts/taskResponseConst';

import {message} from 'antd';
import TaskApi from '../../../../../../api/task/index';
import TimeUntiles from '../../../../../../services/utils/time';
import ITask from '../../../../../../api/task/interfaces/ITask';
import statuses from '../../../../../../api/consts/CTaskProgressTask';
import CTaskStatus from '../../../../../../api/consts/CTaskStatus';

interface IProps {
  task: ITask;
  onClick?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
}

interface IState {
  task: ITask;
  onClick: () => void;
}

export default class TaskCandidateView extends React.Component<IProps, IState> {
  private taskApi: TaskApi;
  constructor(props: any) {
    super(props);
    this.state = {
        task: this.props.task,
        onClick: this.props.onClick,
    };
    this.taskApi = new TaskApi();
  }

  public componentWillReceiveProps(newProps: IProps) {

    this.setState({
        task: newProps.task,
    });
  }

  public onAccept() {
    this.taskApi.respond(this.state.task._id, C_TASK_RESPONSE.ACCEPT)
    .then((response) => {
      console.log(response);
      // todo update task and redux
      if (typeof this.props.onAccept === 'function') {
        this.props.onAccept();
      }
    })
    .catch(() => {
      message.success('An error has occurred.', 10);
    });
  }

  public onReject() {
    this.taskApi.respond(this.state.task._id, C_TASK_RESPONSE.REJECT)
    .then((response) => {
      console.log(response);
      // todo update task and redux
      if (typeof this.props.onDecline === 'function') {
        this.props.onDecline();
      }
    })
    .catch(() => {
      message.success('An error has occurred.', 10);
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
    console.log(task);
    return (
      <div className={style.candidateItem + ' ' + style.taskItem}>
          <div className={style.taskItemInner}>
            <TaskIcon status={taskStatus} progress={progress}/>
            <div className={style.taskContent}>
              <div className={style.taskHead}>
                <h4>{task.title}</h4>
                <span>{TimeUntiles.dynamic(task.due_date)}</span>
              </div>
              <div className={style.taskDetail}>
                from <FullName user_id={task.assignor}/> to <FullName user_id={task.assignee}/>
              </div>
            </div>
          </div>
          <div className={style.taskFooter + ' ' + style.candidateButtons}>
            <div className={style.declineButton} onClick={this.onReject}>
              I can’t
            </div>
            <div className={style.acceptButton} onClick={this.onAccept}>
              I do this
            </div>
          </div>
      </div>
    );
  }
}
