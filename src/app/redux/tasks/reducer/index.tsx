import {ITaskAction} from '../ITaskStore';
import * as Immutable from 'seamless-immutable';
import * as ActionTypes from '../actions/types';
import ITask from '../../../api/task/interfaces/ITask';

/** Initial Places State */
const initialState = Immutable.from<ITaskStore>({
  tasks: [],
});

export default function taskReducer(state = initialState, action?: ITaskAction) {

  switch (action.type) {
    case ActionTypes.TASK_ADD:
      // check state for finding place
      if (action.payload === undefined) {
        return state;
      }
      const tasks = Immutable.getIn(state, ['tasks']);
      const indexOfTask: number = tasks.findIndex((a: ITask) => {
        return a._id === action.payload._id;
      });

      /**
       * Task Add Action
       *
       * this part check current application state for
       * finding tasks and then update tasks state if tasks exist.
       * Otherwise add tasks to tasks list
       *
       * NOTICE::if this tasks is exist in state.tasks, this case will bypass to TASK_UPDATE
       *
       */
      if (indexOfTask === -1) {
        const newState = [action.payload].concat(Immutable(state.tasks));
        return Immutable({tasks: newState});
      } else {
        return state;
      }

    case ActionTypes.TASK_UPDATE:
      let currentTaskList;
      currentTaskList = Immutable.asMutable(state, ['tasks']);
      // console.log(currentTaskList);
      currentTaskList.tasks[indexOfTask] = action.payload;
      return currentTaskList;

    default :
      return state;

  }
}
