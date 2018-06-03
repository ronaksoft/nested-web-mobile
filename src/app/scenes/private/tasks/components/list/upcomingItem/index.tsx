
import * as React from 'react';

import {connect} from 'react-redux';
const style = require('../taskViewItem.css');
import {TaskIcon, IcoN, FullName} from 'components';
import {C_TASK_RESPONSE} from '../../../../../../api/task/consts/taskResponseConst';
import {IUser} from 'api/interfaces';
import {message} from 'antd';
import TaskApi from '../../../../../../api/task/index';
import TimeUntiles from '../../../../../../services/utils/time';
import ITask from '../../../../../../api/task/interfaces/ITask';
import statuses from '../../../../../../api/consts/CTaskProgressTask';
import CTaskStatus from '../../../../../../api/consts/CTaskStatus';

interface IOwnProps {
  task: ITask;
  onClick?: () => void;
  onAccept?: () => void;
  onDecline?: () => void;
  from?: boolean;
  to?: boolean;
  withDetails?: boolean;
}

interface IProps {
  user: IUser;
  task: ITask;
  onClick: () => void;
  onAccept: () => void;
  onDecline: () => void;
  from: boolean;
  to: boolean;
  withDetails: boolean;
}

interface IState {
  task: ITask;
  onClick: () => void;
}

class TaskUpcomingView extends React.Component<IProps, IState> {
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

  public onAccept = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.taskApi.respond(this.state.task._id, C_TASK_RESPONSE.ACCEPT)
    .then(() => {
      // todo update task and redux
      if (typeof this.props.onAccept === 'function') {
        this.props.onAccept();
      }
    })
    .catch(() => {
      message.success('An error has occurred.', 10);
    });
  }

  public onReject = () => {
    event.preventDefault();
    event.stopPropagation();
    this.taskApi.respond(this.state.task._id, C_TASK_RESPONSE.REJECT)
    .then(() => {
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
    let progress = -1;
    if (task.todos && task.todos.length > 0) {
      const total = task.todos.length;
      let done = 0;
      task.todos.forEach((todo) => {
        if (todo.done) {
          done++;
        }
      });

      progress = Math.ceil((done / total) * 100);
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

    const isCandidate = taskStatus === statuses.NOT_ASSIGNED && task.candidates && task.candidates.length > 0;
    const isOverdue = taskStatus === statuses.OVERDUE;
    const isCompleted = taskStatus === statuses.COMPLETED;
    const isRejected = taskStatus === statuses.REJECTED;
    return (
      <div className={
        (isOverdue ? style.overDueItem : '')
        + (isCandidate
          ? style.candidateItem
          : '')
        + (isCompleted ? style.completedItem : '')
        + ' '
        + (isRejected ? style.rejectedItem : '')
        + ' '
        + style.taskItem}>
        <div className={style.taskItemInner}>
          <TaskIcon status={taskStatus} progress={progress}/>
          <div className={style.taskContent}>
            <div className={style.taskHead}>
              <h4>{task.title}</h4>
              {task.due_date > 0 &&
                <span>{TimeUntiles.dynamicTask(task.due_date, task.due_data_has_clock)}</span>
              }
            </div>
            {(!isCandidate && !isRejected && this.props.withDetails) && (
              <div className={style.taskDetail}>
                {(task.assignor && this.props.from !== false) && (
                  <span>from <b><FullName user_id={task.assignor}/></b></span>
                )}
                {(task.assignee && this.props.to !== false) && (
                  <span> to <b><FullName user_id={task.assignee}/></b></span>
                )}
              </div>
            )}
            {isCandidate && (
              <div className={style.taskDetail}>
                waiting for candidates response.
              </div>
            )}
            {isRejected && (
              <div className={style.taskDetail}>
                All candidates rejected task.
              </div>
            )}
            {this.props.withDetails && (
              <div className={style.taskExtra}>
                  {task.description.length > 0 && (
                    <div>
                      <IcoN name={'petition16'} size={16}/>
                    </div>
                  )}
                  {task.todos.length > 0 && <IcoN name={'bulletList16'} size={16}/>}
                  {task.counters.attachments > 0 && <IcoN name={'attach16'} size={16}/>}
                  {task.counters.watchers > 0 && <IcoN name={'person16'} size={16}/>}
                  {task.counters.labels > 0 && <IcoN name={'tag16'} size={16}/>}
                  <div className={style.fill}/>
                  {task.counters.comments > 0 && (
                    <div>
                      {/* TODO : apply format number */}
                      <span>{task.counters.comments}</span>
                      <IcoN name={'comments16'} size={16}/>
                    </div>
                  )}
              </div>
            )}
          </div>
        </div>
          {isCandidate && task.candidates.find((user) => user._id === this.props.user._id) && (
            <div className={style.taskFooter + ' ' + style.candidateButtons}>
              <div className={style.declineButton} onClick={this.onReject}>
                I can’t
              </div>
              <div className={style.acceptButton} onClick={this.onAccept}>
                I do this
              </div>
            </div>
          )}
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  user: store.app.user,
  task: ownProps.task,
  onClick: ownProps.onClick,
  onAccept: ownProps.onAccept,
  onDecline: ownProps.onDecline,
  from: ownProps.from,
  to: ownProps.to,
  withDetails: ownProps.withDetails,
});

export default connect(mapStateToProps, {})(TaskUpcomingView);
