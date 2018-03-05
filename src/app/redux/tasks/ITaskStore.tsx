import ITask from '../../api/task/interfaces/ITask';

export interface ITaskStore {
  tasks: ITask[];
}

export interface ITaskAction {
  type: string;
  payload?: ITask;
}
