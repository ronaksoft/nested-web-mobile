import * as React from 'react';
import {
  Comment, ChangeTitle, ChangeDescription, AssigneeChanged,
  AddCandidate, RemoveCandidate, AddWatcher, RemoveWatcher,
  AddEditor, RemoveEditor, RemoveLabel, AddLabel,
  AddTodo, RemoveTodo, ChangeTodo, DoneTodo, UndoneTodo,
  AddAttachment, RemoveAttachment, Created, Updated,
  ChangeStatus, RemoveDueDate, ChangeDueDate,
} from './partials';
import {ITaskActivity} from 'api/interfaces/';
import C_TASK_ACTIVITY from 'api/consts/CTaskActivity';

interface IProps {
  activity: ITaskActivity;
}

interface IState {
  activity: ITaskActivity;
}

class ActivitiyItem extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    /**
     * @type {object}
     * @desc setting initial states
     * @property {string} activity items
     */
    this.state = {
      activity: this.props.activity,
    };
  }
  /**
   * after mounting the component , recieve the notifications from api call and set it in redux store.
   * @memberof ActivitiyItem
   */
  public componentDidMount() {
    this.setState({
      activity: this.props.activity,
    });
  }

  /**
   * updates the state object when the parent changes the props
   * @param {IProps} newProps
   * @memberof ActivitiyItem
   */
  public componentWillReceiveProps(newProps: IProps) {
    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {string}
     */
    this.setState({
      activity: newProps.activity,
    });
  }
  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof ActivitiyItem
   */
  public render() {
    const {activity} = this.state;
    switch (activity.action) {
      case C_TASK_ACTIVITY.COMMENT:
        return (
          <Comment activity={activity}/>
        );
      case C_TASK_ACTIVITY.TITLE_CHANGED:
        return (
          <ChangeTitle activity={activity}/>
        );
      case C_TASK_ACTIVITY.DESC_CHANGED:
        return (
          <ChangeDescription activity={activity}/>
        );
      case C_TASK_ACTIVITY.ASSIGNEE_CHANGED:
        return (
          <AssigneeChanged activity={activity}/>
        );
      case C_TASK_ACTIVITY.CANDIDATE_ADDED:
        return (
          <AddCandidate activity={activity}/>
        );
      case C_TASK_ACTIVITY.CANDIDATE_REMOVED:
        return (
          <RemoveCandidate activity={activity}/>
        );
      case C_TASK_ACTIVITY.WATCHER_ADDED:
        return (
          <AddWatcher activity={activity}/>
        );
      case C_TASK_ACTIVITY.WATCHER_REMOVED:
        return (
          <RemoveWatcher activity={activity}/>
        );
      case C_TASK_ACTIVITY.EDITOR_ADDED:
        return (
          <AddEditor activity={activity}/>
        );
      case C_TASK_ACTIVITY.EDITOR_REMOVED:
        return (
          <RemoveEditor activity={activity}/>
        );
      case C_TASK_ACTIVITY.LABEL_ADDED:
        return (
          <AddLabel activity={activity}/>
        );
      case C_TASK_ACTIVITY.LABEL_REMOVED:
        return (
          <RemoveLabel activity={activity}/>
        );
      case C_TASK_ACTIVITY.TODO_ADDED:
        return (
          <AddTodo activity={activity}/>
        );
      case C_TASK_ACTIVITY.TODO_REMOVED:
        return (
          <RemoveTodo activity={activity}/>
        );
      case C_TASK_ACTIVITY.TODO_CHANGED:
        return (
          <ChangeTodo activity={activity}/>
        );
      case C_TASK_ACTIVITY.TODO_DONE:
        return (
          <DoneTodo activity={activity}/>
        );
      case C_TASK_ACTIVITY.TODO_UNDONE:
        return (
          <UndoneTodo activity={activity}/>
        );
      case C_TASK_ACTIVITY.ATTACHMENT_ADDED:
        return (
          <AddAttachment activity={activity}/>
        );
      case C_TASK_ACTIVITY.ATTACHMENT_REMOVED:
        return (
          <RemoveAttachment activity={activity}/>
        );
      case C_TASK_ACTIVITY.CREATED:
        return (
          <Created activity={activity}/>
        );
      case C_TASK_ACTIVITY.UPDATED:
        return (
          <Updated activity={activity}/>
        );
      case C_TASK_ACTIVITY.STATUS_CHANGED:
        return (
          <ChangeStatus activity={activity}/>
        );
      case C_TASK_ACTIVITY.DUE_DATE_REMOVED:
        return (
          <RemoveDueDate activity={activity}/>
        );
      case C_TASK_ACTIVITY.DUE_DATE_UPDATED:
        return (
          <ChangeDueDate activity={activity}/>
        );
      default:
        return null;
    }
  }
}

export {ActivitiyItem}
