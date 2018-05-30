import Api from 'api';
import ITaskRequest from './interfaces/ITaskRequest';
import IGetTaskCustomFilterRequest from './interfaces/IGetTaskCustomFilterRequest';
import ITaskUpdateTodoRequest from './interfaces/ITaskUpdateTodoRequest';
import ITaskGetByFilterRequest from './interfaces/ITaskGetByFilterRequest';
import C_TASK_RESPONSE from './consts/taskResponseConst';
import C_TASK_STATUS from './consts/taskStatusConst';
import C_TASK_STATE from './consts/taskStateConst';
import {IGetActivitiesRequest} from './interfaces/ITaskActivities';

export default class TaskApi {
  /**
   * @prop api
   * @desc An instance of Api
   * @private
   * @memberof TaskApi
   */
  private api;

  /**
   * Creates an instance of TaskApi.
   * @memberof TaskApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func getMany
   * @desc Requests tasks comma seperated
   * @param {string} postId
   * @returns
   * @memberof TaskApi
   */
  public getMany(taskId: string) {
    return this.api.request({
      cmd: 'task/get_many',
      data: {
        task_id: taskId,
      },
    });
  }

  public create(data: ITaskRequest) {
    return this.api.request({
      cmd: 'task/create',
      data,
    });
  }

  public remove(taskId: string) {
    return this.api.request({
      cmd: 'task/remove',
      data: {
        task_id: taskId,
      },
    });
  }

  public respond(taskId: string, response: C_TASK_RESPONSE, reason?: string) {
    return this.api.request({
      cmd: 'task/respond',
      data: {
        task_id: taskId,
        response,
        reason,
      },
    });
  }

  public setStatus(taskId: string, status: C_TASK_STATUS) {
    return this.api.request({
      cmd: 'task/set_status',
      data: {
        task_id: taskId,
        status,
      },
    });
  }

  public setState(taskId: string, state: C_TASK_STATE) {
    return this.api.request({
      cmd: 'task/set_state',
      data: {
        task_id: taskId,
        state,
      },
    });
  }

  public update(data: ITaskRequest) {
    return this.api.request({
      cmd: 'task/update',
      data,
    });
  }

  public comment(taskId: string, txt: string) {
    return this.api.request({
      cmd: 'task/add_comment',
      data: {
        task_id: taskId,
        txt,
      },
    });
  }

  public removeComment(taskId: string, activityId: string) {
    return this.api.request({
      cmd: 'task/remove_comment',
      data: {
        task_id: taskId,
        activity_id: activityId,
      },
    });
  }

  public attach(taskId: string, universalId: string) {
    return this.api.request({
      cmd: 'task/add_attachment',
      data: {
        task_id: taskId,
        universal_id: universalId,
      },
    });
  }

  public removeAttachment(taskId: string, universalId: string) {
    return this.api.request({
      cmd: 'task/remove_attachment',
      data: {
        task_id: taskId,
        universal_id: universalId,
      },
    });
  }

  public addLabel(taskId: string, labelId: string) {
    return this.api.request({
      cmd: 'task/add_label',
      data: {
        task_id: taskId,
        label_id: labelId,
      },
    });
  }

  public removeLabel(taskId: string, labelId: string) {
    return this.api.request({
      cmd: 'task/remove_label',
      data: {
        task_id: taskId,
        label_id: labelId,
      },
    });
  }

  public addTodo(taskId: string, labelId: string, weight?: string) {
    return this.api.request({
      cmd: 'task/add_todo',
      data: {
        task_id: taskId,
        label_id: labelId,
        weight,
      },
    });
  }

  public updateTodo(data: ITaskUpdateTodoRequest) {
    return this.api.request({
      cmd: 'task/update_todo',
      data,
    });
  }

  public removeTodo(taskId: string, todoId: string) {
    return this.api.request({
      cmd: 'task/remove_todo',
      data: {
        task_id: taskId,
        todo_id: todoId,
      },
    });
  }

  public addWatcher(taskId: string, watcherId: string) {
    return this.api.request({
      cmd: 'task/add_watcher',
      data: {
        task_id: taskId,
        watcher_id: watcherId,
      },
    });
  }

  public removeWatcher(taskId: string, watcherId: string) {
    return this.api.request({
      cmd: 'task/remove_watcher',
      data: {
        task_id: taskId,
        watcher_id: watcherId,
      },
    });
  }

  public updateAssignee(taskId: string, accountId: string) {
    return this.api.request({
      cmd: 'task/update_assignee',
      data: {
        task_id: taskId,
        account_id: accountId,
      },
    });
  }

  public addCandidate(taskId: string, candidateId: string) {
    return this.api.request({
      cmd: 'task/add_candidate',
      data: {
        task_id: taskId,
        candidate_id: candidateId,
      },
    });
  }

  public removeCandidate(taskId: string, candidateId: string) {
    return this.api.request({
      cmd: 'task/remove_candidate',
      data: {
        task_id: taskId,
        candidate_id: candidateId,
      },
    });
  }

  public getByFilter(data: ITaskGetByFilterRequest) {
    return this.api.request({
      cmd: 'task/get_by_filter',
      data,
    });
  }

  public getByCustomFilter(data: IGetTaskCustomFilterRequest) {
    return this.api.request({
      cmd: 'task/get_by_custom_filter',
      data,
    });
  }

  public getActivities(data: IGetActivitiesRequest) {
    return this.api.request({
      cmd: 'task/get_activities',
      data,
    });
  }

  public getManyActivities(activityId: string, details?: boolean) {
    return this.api.request({
      cmd: 'task/get_many_activities',
      data: {
        activity_id: activityId,
        details,
      },
    });
  }

}
