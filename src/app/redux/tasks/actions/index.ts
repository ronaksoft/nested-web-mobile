import {ITaskAction} from '../ITaskStore';
import * as ActionTypes from './types';
import ITask from '../../../api/task/interfaces/ITask';

export function taskAdd(task: ITask): ITaskAction {
  return {
    type: ActionTypes.TASK_ADD,
    payload: task,
  };
}
export function taskUpdate(task: ITask): ITaskAction {
  return {
    type: ActionTypes.TASK_UPDATE,
    payload: task,
  };
}
