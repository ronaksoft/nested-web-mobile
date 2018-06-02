/**
 * @file scenes/private/posts/components/post/index.tsx
 * @author robzizo <me@robzizo.ir>
 * @description A task view component
 * Documented by:          robzizo <me@robzizo.ir>
 * Date of documentation:  2018-02-24
 * Reviewed by:            -
 * Date of review:         -
 */

import * as React from 'react';
import ITask from '../../../../../api/task/interfaces/ITask';
import {IcoN, Loading, Scrollable, RTLDetector, TaskIcon,
  UserAvatar, FullName, Suggestion, TaskAttachment} from 'components';
import TaskApi from '../../../../../api/task/index';
import {connect} from 'react-redux';
import {setCurrentTask, setTasks} from '../../../../../redux/app/actions/index';
import {hashHistory, Link} from 'react-router';
import {IUser} from 'api/interfaces';
import {IChipsItem} from 'components/Chips';
import C_TASK_STATUS from 'api/consts/CTaskStatus';
import C_TASK_ACCESS from 'api/consts/CTaskAccess';
import statuses from 'api/consts/CTaskProgressTask';
import {difference, some, differenceBy, clone} from 'lodash';
import TimeUntiles from 'services/utils/time';

const style = require('../../task.css');
const buttonsStyle = require('../../../../../components/buttons/style.css');
const AttachmentHandlerStyle = require('../../../../../components/AttachmentHandler/style.css');
const styleNavbar = require('../../../../../components/navbar/navbar.css');
const privateStyle = require('../../../private.css');

/**
 * @interface IOwnProps
 * @desc The component owned properties
 */
interface IOwnProps {
  task?: ITask;
  routeParams?: any;
}

/**
 * @interface IProps
 * @desc The component properties including the owned and the props are provided by route and redux
 */
interface IProps {
  task: ITask;
  /**
   * @prop post
   * @desc A post model
   * @type {IPost}
   * @memberof IProps
   */
  currentTask: ITask;
  /**
   * @prop posts
   * @desc The stored posts which are given by redux
   * @type {IPost[]}
   * @memberof IProps
   */
  tasks: ITask[];
  /**
   * @prop routeParams
   * @desc The parameters which are provided by React Router
   * @type {*}
   * @memberof IProps
   */
  routeParams: any;
  /**
   * @prop setPosts
   * @desc Updates posts in store
   * @memberof IProps
   */
  setTasks: (posts: ITask[]) => {};
  /**
   * @prop setCurrentPost
   * @desc Updates the last post in store
   * @memberof IProps
   */
  setCurrentTask: (post: ITask) => {};
  /**
   * @prop user
   * @desc Current loggedin user
   * @memberof IProps
   */
  user: IUser;
}

/**
 * @interface IState
 * @desc Interface of the component state
 */
interface IState {
  /**
   * @prop post
   * @memberof IState
   */
  task?: ITask | null;
  /**
   * @prop showMoreOptions
   * @memberof IState
   */
  showMoreOptions: boolean;
  Loading: boolean;
  attachModal: boolean;
}

/**
 * @class EditTask
 * @extends {React.Component<IProps, IState>}
 * @desc A task-viw component
 */
class EditTask extends React.Component<IProps, IState> {
  private TaskApi: TaskApi;
  private originalTask: ITask;
  /**
   * define inProgress flag
   * @property {boolean} inProgress
   * @memberof Post
   */
  private inProgress: boolean;
  /**
   * @prop mediaMode
   * @desc The user can upload an attachment as a file or media. We use this flag
   * to identify which upload button has been clicked.
   * @private
   * @type {boolean}
   */
  private mediaMode: boolean;
  private scrollRef: any;
  private subjectRtl: boolean;
  private descriptionRtl: boolean;
  private pristineForm: boolean = true;
  private startedEditing: boolean = false;
  private editMode: boolean = false;
  private createMode: boolean = true;
  private viewMode: boolean = false;
  private activeRows: any = {
    date: false,
    description: false,
    todos: false,
    attachments: false,
    watchers: false,
    editors: false,
    labels: false,
  };
  /**
   * @prop file
   * @desc Html input of file type
   * @private
   * @type {HTMLInputElement}
   * @memberof Compose
   */
  private file: HTMLInputElement;

  /**
   * @prop targets
   * @desc Reference of `Suggestion` component
   * @private
   * @type {Suggestion}
   * @memberof Compose
   */
  private assigneSuggestionComponent: Suggestion;

  /**
   * Creates an instance of Post.
   * @param {IProps} props
   * @memberof Post
   */
  constructor(props: IProps) {
    super(props);
    this.inProgress = false;
    this.state = {
      task: this.props.task,
      showMoreOptions: false,
      Loading: false,
      attachModal: false,
    };
  }

  private updateLabels = (labels) => {
    const removeItems = difference(this.state.task.labels, labels);
    const addItems = difference(labels, this.state.task.labels);
    removeItems.forEach((element) => {
      this.removeLabel(element._id);
    });
    addItems.forEach((element) => {
      this.addLabel(element._id);
    });
    const task: ITask = this.state.task;
    task.labels = labels;
    this.setState({
        task,
    });
  }

  /**
   * @function componentDidMount
   * @desc Uses the provided post in props or asks server to get the post by
   * the given `postId` parameter in route also Marks the post as read.
   * @memberof Post
   * @override
   */
  public componentDidMount() {
    this.TaskApi = new TaskApi();
    if (this.props.task) {

      this.subjectRtl = RTLDetector.getInstance().direction(this.props.task.title);
      this.descriptionRtl = RTLDetector.getInstance().direction(this.props.task.description);

      this.initTask(this.props.task);
      this.setState({
        task: this.props.task ? this.props.task : null,
      });
    } else {
      this.TaskApi.getMany(this.props.routeParams.taskId)
        .then((response) => {
          this.initTask(response.tasks[0]);
          this.setState({
            task: response.tasks[0],
          });
        });
      // scroll top to clear previous page scroll
      window.scrollTo(0, 0);
    }
  }

  private initTask = (task: ITask) => {
    if (task.access.indexOf(C_TASK_ACCESS.UPDATE_TASK) > -1) {
      this.editMode = true;
      this.createMode = false;
      this.viewMode = false;
    }
    this.originalTask = clone(task);
    if (task.attachments && task.attachments.length > 0) {
      this.activeRows.attachments = true;
    }
    if (task.watchers && task.watchers.length > 0) {
      this.activeRows.watchers = true;
    }
    if (task.todos && task.todos.length > 0) {
      this.activeRows.todos = true;
    }
    if (task.due_date) {
      this.activeRows.date = true;
    }
    if (task.labels && task.labels.length > 0) {
      this.activeRows.labels = true;
    }
    if (task.editors && task.editors.length > 0) {
      this.activeRows.editors = true;
    }
    if (task.description) {
      this.activeRows.description = true;
    }
  }

  private removeLabel(id: string) {
    this.TaskApi.removeLabel(this.state.task._id, id);
  }

  private addLabel(id: string) {
    this.TaskApi.addLabel(this.state.task._id, id);
  }

  public enableRow(row: string) {
    this.activeRows[row] = true;
    this.startedEditing = true;
    this.forceUpdate();
  }

  public disableRow(row: string) {
    this.startedEditing = true;
    this.pristineForm = false;
    this.activeRows[row] = false;
    const task = this.state.task;
    switch (row) {
      case 'todos':
        task.todos = [];
        break;
      case 'date':
        task.due_date = null;
        break;
      case 'description':
        task.description = '';
        break;
      case 'attachments':
        task.attachments = [];
        break;
      case 'watchers':
        task.watchers = [];
        break;
      case 'editors':
        task.editors = [];
        break;
      case 'labels':
        task.labels = [];
        break;
      default:
        break;
    }
    this.setState({
      task,
    });
  }

  private discardTask = () => {
    console.log(this.originalTask, this.state.task);
    if (this.pristineForm) {
      this.startedEditing = false;
      return this.forceUpdate();
    }
    this.pristineForm = true;
    this.setState({
      task: this.originalTask,
    });
  }

  private saveTask = () => {
    this.startedEditing = true;
    this.setState({
      Loading: true,
    });
    this.updateTodos(this.state.task.todos);
    this.updateLabels(this.state.task.labels);
  }

  private startEdit = () => {
    this.startedEditing = true;
    this.forceUpdate();
  }

  private updateTodos = (todos) => {
    const oldData = this.originalTask;
    const newItems = differenceBy(todos, oldData, 'id');
    const removedItems = differenceBy(oldData, todos, 'id');

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        console.log(item);
        this.TaskApi.addTodo(this.state.task._id, item.txt, 1).then((res) => {
          console.log(res);
          // vm.model.todos[index].id = data.todo_id;
          // todo update originaltask
        }).catch((err) => {
          console.log(err);
        });
      });
    }

    if (removedItems.length > 0) {
      console.log(removedItems);
      // todo : update
      removedItems.forEach((item) => {
        console.log(item);
        this.TaskApi.removeTodo(this.state.task._id, item._id).then((res) => {
          console.log(res);
          // vm.model.todos[index].id = data.todo_id;
          // todo update originaltask
        }).catch((err) => {
          console.log(err);
        });
      });
    }
  }

  private checkTodo = (index) => {
    const task = this.state.task;
    const isChecked: boolean = !task.todos[index].done;
    task.todos[index].done = isChecked;
    this.TaskApi.updateTodo({
      done: isChecked,
      task_id: this.state.task._id,
      todo_id: this.state.task.todos[index]._id,
    });
    // update original task todo too
    // todo : update progress
    // todo : if all done so finish task
  }

  private todoTextEdit(index, event) {
    const task = this.state.task;
    this.pristineForm = false;
    const txt: string = event.target.value;
    task.todos[index].txt = txt;
    this.setState({task});
  }

  private descriptionEdit = (event) => {
    const task = this.state.task;
    this.pristineForm = false;
    const txt: string = event.target.value;
    task.description = txt;
    this.setState({task});
  }

  private editTitle = (event) => {
    const task = this.state.task;
    this.pristineForm = false;
    const txt: string = event.target.value;
    task.title = txt;
    this.setState({task});
  }

  public newCommentReceived = () => {
    this.scrollRef.scrollDown();
  }

  /**
   * toogle view toolbar of attachments
   * @func attachTypeSelect
   * @private
   */
  private attachTypeSelect = () => {
    this.setState({
      attachModal: !this.state.attachModal,
    });
  }

  /**
   * @func componentWillReceiveProps
   * @desc Replaces the post in the component state with the new post in received props
   * @param {IProps} newProps
   * @memberof Post
   * @override
   */
  public componentWillReceiveProps(newProps: IProps) {
    if (this.props.task) {
      this.setState({
        task: newProps.task ? newProps.task : null,
      });
    }
  }
  /**
   *
   * @func handleTargetsChanged
   * @desc Updates the component state with a new list of targets
   * @private
   * @memberof Compose
   * @param {IChipsItem[]} items
   */
  private handleTargetsChanged = (items: IChipsItem[]) => {
    this.pristineForm = false;
    console.log(items);
  }

  /**
   * @func leave
   * @desc Routes to the previous page
   * @private
   * @memberof EditTask
   */
  private leave() {
    hashHistory.goBack();
  }

  private toggleMoreOpts = () => {
    this.setState({
      showMoreOptions: !this.state.showMoreOptions,
    });
  }

  private scrollRefHandler = (value) => {
    this.scrollRef = value;
  }

  /**
   * register a handler for click on black overlay
   * @private
   * @func overlayClick
   */
  private overlayClick = (event) => {
    event.stopPropagation();
  }

  /**
   * @func selectFile
   * @desc Opens a file browser to select a file
   * @private
   * @memberof Compose
   * @param {boolean} isMedia
   */
  private selectFile = (isMedia: boolean) => {
    return () => {
      this.file.click();
      this.mediaMode = isMedia;
      this.setState({
        attachModal: false,
      });
    };
  }

  /**
   * @func upload
   * @desc Uploads the given file using AttchamnetList component upload method
   * @param {*} e
   * @private
   * @memberof Compose
   */
  private upload = (e: any) => {
    console.log(e, this.mediaMode);
    // this.attachments.upload(e, this.mediaMode);
  }

  /**
   * @func referenceFile
   * @desc Keep reference of HtmlInputElement component
   * @private
   * @memberof Compose
   * @param {HTMLInputElement} value
   */
  private referenceFile = (value: HTMLInputElement) => {
    this.file = value;
  }

  /**
   * @func referenceTargets
   * @desc Keeps reference of Suggestion component
   * @private
   * @memberof Compose
   * @param {Suggestion} value
   */
  private referenceTargets = (value: Suggestion) => {
    this.assigneSuggestionComponent = value;
  }
  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof Post
   * @generator
   */
  public render() {
    const {task} = this.state;
    const taskView = !this.props.task;
    if (!task) {
      return <Loading active={true} position="absolute"/>;
    }

    let selectedItemsForAssigne = [];
    if (task.assignee) {
      selectedItemsForAssigne = [{
        _id: task.assignee._id,
        fullName: task.assignee.fname + task.assignee.lname,
        picture: task.assignee.picture,
      }];
    } else if (task.candidates) {
      selectedItemsForAssigne = task.candidates.map((i) => {
        const chipsItem: IChipsItem = {
          _id: i._id,
          name: i.name,
          picture: i.picture,
        };
        return chipsItem;
      });
    }

    const isHold = task.status === C_TASK_STATUS.HOLD;
    const isCompleted = task.status === C_TASK_STATUS.COMPLETED;
    const isFailed = task.status === C_TASK_STATUS.FAILED;
    const isInProgress = !(isHold || isCompleted || isFailed);
    const someRowNotBinded = some(Object.keys(this.activeRows), (rowKey) => !this.activeRows[rowKey]);
    return (
      <div className={[style.taskView, !this.props.task ? style.postView : null].join(' ')}>
        {/* specefic navbar for post view */}
        {taskView && (
          <div className={styleNavbar.navbar}>
            <a onClick={this.leave}>
              <IcoN size={24} name="xcross24"/>
            </a>
            <div className={styleNavbar.filler}/>
            {this.editMode && this.startedEditing && (
              <div className={[buttonsStyle.butn, buttonsStyle.butnSolid, buttonsStyle.secondary,
                styleNavbar.butnPrimary].join(' ')}
                onClick={this.discardTask}>Discard</div>
            )}
            {this.editMode && this.startedEditing && (
              <button className={[buttonsStyle.butn, buttonsStyle.butnPrimary, styleNavbar.butnPrimary].join(' ')}
                onClick={this.saveTask} disabled={this.pristineForm}>Save</button>
            )}
            {this.editMode && !this.startedEditing && (
              <div className={[buttonsStyle.butn, buttonsStyle.butnSolid, buttonsStyle.secondary,
                styleNavbar.butnPrimary].join(' ')}
                onClick={this.startEdit}>Edit</div>
            )}
            {!this.createMode && (
              <a onClick={this.toggleMoreOpts}>
                <IcoN size={24} name="more24"/>
              </a>
            )}
          </div>
        )}
        {this.state.showMoreOptions && (
          <div className={[style.postOptions, style.opened].join(' ')}>
            <ul>
              <li className={isInProgress ? 'active' : ''}>
                <IcoN size={16} name={'taskInProgress16'}/>
                <Link to={`/forward/${task._id}`}>In Progress</Link>
              </li>
              <li className={isHold ? 'active' : ''}>
                <IcoN size={16} name={'taskHold16'}/>
                <Link to={`/forward/${task._id}`}>Hold</Link>
              </li>
              <li className={isCompleted ? 'active' : ''}>
                <IcoN size={16} name={'taskCompleted16'}/>
                <Link to={`/forward/${task._id}`}>Completed</Link>
              </li>
              <li className={isFailed ? 'active' : ''}>
                <IcoN size={16} name={'failed16'}/>
                <Link to={`/forward/${task._id}`}>Failed</Link>
              </li>
              <li className={style.hr}/>
              <li>
                <IcoN size={16} name={'chain16'}/>
                <Link to={`/forward/${task._id}`}>Create a related Task</Link>
              </li>
              <li>
                <IcoN size={16} name={'bin16'}/>
                <Link to={`/forward/${task._id}`}>Delete</Link>
              </li>
            </ul>
          </div>
        )}
        {this.state.showMoreOptions &&
          <div onClick={this.toggleMoreOpts} className={style.overlay}/>
        }
        <Scrollable active={true} ref={this.scrollRefHandler} shrinkHeight={someRowNotBinded ? 56 : 0}>
          <div className={style.postScrollContainer}>
            <div className={style.postScrollContent}>
              <div className={style.taskRow}>
                <div className={style.taskRowIcon}>
                  <TaskIcon status={statuses.ASSIGNED_CHECKLIST} progress={task.progress}/>
                </div>
                {this.editMode && (
                  <div className={style.taskRowItem}>
                    {this.startedEditing && (
                      <h1>
                        <input type="text" placeholder="Task title" value={task.title} onChange={this.editTitle}/>
                      </h1>
                    )}
                    {!this.startedEditing && (
                      <h1>
                        {task.title}
                      </h1>
                    )}
                  </div>
                )}
                {this.viewMode && (
                  <div className={style.taskRowItem}>
                    {task.title}
                  </div>
                )}
                {this.createMode && (
                  <div className={style.taskRowItem}>
                    <input type="text" placeholder="Task title"/>
                  </div>
                )}
              </div>
              <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                <div className={style.taskRowIcon}>
                  {task.assignee && <UserAvatar user_id={task.assignee._id} borderRadius="24px" size={24}/>}
                  {!task.assignee && !task.candidates && <IcoN name="askWire24" size={24}/>}
                  {task.candidates && <IcoN name="candidate32" size={32}/>}
                </div>
                {this.viewMode && (
                  <div className={style.taskRowItem}>
                    Assigned to <b> <FullName user_id={task.assignee._id} /></b>
                    Candidates: {task.candidates.map((user) => <b>{user.fullName}</b>)}
                  </div>
                )}
                {this.createMode || this.editMode && (
                  <div className={style.taskRowItem}>
                    <Suggestion ref={this.referenceTargets}
                                mode="user"
                                editable={this.startedEditing || this.createMode}
                                placeholder="Assignees"
                                selectedItems={selectedItemsForAssigne}
                                onSelectedItemsChanged={this.handleTargetsChanged}
                    />
                  </div>
                )}
              </div>
              {this.activeRows.date && (
                <div className={style.taskRow}>
                  <div className={style.taskRowIcon}>
                    <IcoN name="finishFlag16" size={16}/>
                  </div>
                  <div className={[style.taskRowItem, style.vertical].join(' ')}>
                    <h4>
                      <span>Set due time...</span>
                      {this.startedEditing && (
                      <div onClick={this.disableRow.bind(this, 'date')}><IcoN name="binRed16" size={16}/></div>
                      )}
                    </h4>
                    <ul className={style.setDateTime}>
                      <li>
                        {this.startedEditing && (
                          <input type="date" placeholder="Set date..."
                            pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" value={TimeUntiles.Date(task.due_date)}/>
                        )}
                        {!this.startedEditing && (
                          <time dateTime={TimeUntiles.Date(task.due_date)}>{TimeUntiles.DateParse(task.due_date)}</time>
                        )}
                      </li>
                      <li>
                        {this.startedEditing && (
                          <input type="time" placeholder="Set time..." pattern="[0-9]{2}:[0-9]{2}" min="00:00"
                            value={task.due_data_has_clock ? TimeUntiles.Time(task.due_date) : ''} max="23:59"/>
                        )}
                        {!this.startedEditing && task.due_data_has_clock && (
                          <time dateTime={TimeUntiles.Time(task.due_date)}>{TimeUntiles.TimeParse(task.due_date)}</time>
                        )}
                        {!this.startedEditing && !task.due_data_has_clock && (
                          <time>-- : --</time>
                        )}
                      </li>
                    </ul>
                  </div>
                </div>
              )}
              {this.activeRows.description && (
                <div className={style.taskRow}>
                  <div className={style.taskRowIcon}>
                    <IcoN name="petition16" size={16}/>
                  </div>
                  <div className={[style.taskRowItem, style.vertical].join(' ')}>
                    <h4>
                      <span>Description</span>
                      {this.startedEditing && (
                        <div onClick={this.disableRow.bind(this, 'description')}>
                          <IcoN name="binRed16" size={16}/>
                        </div>
                      )}
                    </h4>
                    {this.startedEditing && (
                      <textarea placeholder="Description" className={style.descriptionElement}
                        value={task.description} onChange={this.descriptionEdit}/>
                    )}
                    {!this.startedEditing && (
                      <p>{task.description}</p>
                    )}
                  </div>
                </div>
              )}
              {this.activeRows.todos && (
                <div className={style.taskRow}>
                  <div className={style.taskRowIcon}>
                    <IcoN name="bulletList16" size={16}/>
                  </div>
                  <div className={[style.taskRowItem, style.vertical].join(' ')}>
                    <h4>
                      <span>To-Do List</span>
                      {this.startedEditing && (
                        <div onClick={this.disableRow.bind(this, 'todos')}>
                          <IcoN name="binRed16" size={16}/>
                        </div>
                      )}
                    </h4>
                    <ul className={style.todoList}>
                      {task.todos.map((todo, index) => (
                        <li key={todo._id}>
                          <input type="checkbox" id="todo1" defaultChecked={todo.done}
                            onChange={this.checkTodo.bind(this, index)}/>
                          {this.startedEditing && (
                            <label htmlFor="todo1">
                              <input type="text" value={todo.txt} onChange={this.todoTextEdit.bind(this, index)}/>
                            </label>
                          )}
                          {!this.startedEditing && (
                            <label htmlFor="todo1">{todo.txt}</label>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
              {this.activeRows.attachments && (
                <div className={style.taskRow}>
                  <div className={style.taskRowIcon}>
                    <IcoN name="attach16" size={16}/>
                  </div>
                  <div className={[style.taskRowItem, style.vertical].join(' ')}>
                    <h4>
                      <span>Attachments</span>
                      <div onClick={this.attachTypeSelect}
                          className={[AttachmentHandlerStyle.attachmentBtn,
                          this.state.attachModal ? AttachmentHandlerStyle.attachActive : null].join(' ')}>
                        <div onClick={this.attachTypeSelect}>
                          <IcoN size={16} name={'cross16'}/>
                        </div>
                        {/* attachment popover overlay */}
                        {this.state.attachModal &&
                        <div onClick={this.overlayClick} className={AttachmentHandlerStyle.overlay}/>
                        }
                        {/* attachment buttons */}
                          <div className={AttachmentHandlerStyle.attachActions} onClick={this.overlayClick}>
                            <div onClick={this.selectFile(true)}>
                              <IcoN size={24} name={'camera24'}/>
                            </div>
                            <div onClick={this.selectFile(false)}>
                              <IcoN size={24} name={'attach24'}/>
                            </div>
                            <div onClick={this.attachTypeSelect}>
                              <IcoN size={24} name={'xcross24'}/>
                            </div>
                          </div>
                      </div>
                      {this.startedEditing && (
                        <div onClick={this.disableRow.bind(this, 'attachments')}>
                          <IcoN name="binRed16" size={16}/>
                        </div>
                      )}
                    </h4>
                    {task.attachments && (
                      <TaskAttachment attachments={task.attachments}
                      taskId={task._id} editable={this.startedEditing || this.createMode}/>
                    )}
                  </div>
                </div>
              )}
              {this.activeRows.watchers && (
                <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                  <div className={style.taskRowIcon}>
                  <IcoN name="person16" size={16}/>
                  </div>
                  {this.viewMode && (
                    <div className={style.taskRowItem}>
                      watchers
                    </div>
                  )}
                  {this.createMode || this.editMode && (
                    <div className={[style.taskRowItem, style.vertical].join(' ')}>
                      <h4>
                        <span>Watchers</span>
                        {this.startedEditing && (
                          <div onClick={this.disableRow.bind(this, 'watchers')}>
                            <IcoN name="binRed16" size={16}/>
                          </div>
                        )}
                      </h4>
                      <Suggestion ref={this.referenceTargets}
                                  mode="user"
                                  editable={this.startedEditing || this.createMode}
                                  placeholder="Add peoples who wants to follow task..."
                                  selectedItems={task.watchers}
                                  onSelectedItemsChanged={this.handleTargetsChanged}
                      />
                    </div>
                  )}
                </div>
              )}
              {this.activeRows.editors && (
                <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                  <div className={style.taskRowIcon}>
                  <IcoN name="pencil16" size={16}/>
                  </div>
                  {this.viewMode && (
                    <div className={style.taskRowItem}>
                      editors
                    </div>
                  )}
                  {this.createMode || this.editMode && (
                    <div className={[style.taskRowItem, style.vertical].join(' ')}>
                      <h4>
                        <span>Editors</span>
                        {this.startedEditing && (
                        <div onClick={this.disableRow.bind(this, 'editors')}><IcoN name="binRed16" size={16}/></div>
                        )}
                      </h4>
                      <Suggestion ref={this.referenceTargets}
                                  mode="user"
                                  editable={this.startedEditing || this.createMode}
                                  placeholder="Add peoples who wants to edit task..."
                                  selectedItems={task.editors}
                                  onSelectedItemsChanged={this.handleTargetsChanged}
                      />
                    </div>
                  )}
                </div>
              )}
              {this.activeRows.labels && (
                <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                  <div className={style.taskRowIcon}>
                  <IcoN name="tag16" size={16}/>
                  </div>
                  {this.viewMode && (
                    <div className={style.taskRowItem}>
                      labels
                    </div>
                  )}
                  {this.createMode || this.editMode && (
                    <div className={[style.taskRowItem, style.vertical].join(' ')}>
                      <h4>
                        <span>labels</span>
                        {this.startedEditing && (
                        <div onClick={this.disableRow.bind(this, 'labels')}>
                          <IcoN name="binRed16" size={16}/>
                        </div>
                        )}
                      </h4>
                      <Suggestion ref={this.referenceTargets}
                                  mode="label"
                                  editable={this.startedEditing || this.createMode}
                                  placeholder="Add labels..."
                                  selectedItems={task.labels}
                                  onSelectedItemsChanged={this.handleTargetsChanged}
                      />
                    </div>
                  )}
                </div>
              )}
              {/* {!this.props.post && (
                <CommentsBoard no_comment={this.state.post.no_comment}
                post_id={this.state.post._id} post={this.state.post}
                user={this.props.user}/>
              )} */}
            {taskView && <div className={privateStyle.bottomSpace}/>}
            </div>
          </div>
        </Scrollable>
        {(this.editMode || this.createMode) && someRowNotBinded && (
          <div className={style.taskBinder}>
            {!this.activeRows.date && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'date')}>
                <IcoN name="finishFlag24" size={24}/>
              </div>
            )}
            {!this.activeRows.description && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'description')}>
                <IcoN name="petition24" size={24}/>
              </div>
            )}
            {!this.activeRows.todos && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'todos')}>
                <IcoN name="bulletList24" size={24}/>
              </div>
            )}
            {!this.activeRows.attachments && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'attachments')}>
                <IcoN name="attach24" size={24}/>
              </div>
            )}
            {!this.activeRows.watchers && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'watchers')}>
                <IcoN name="person24" size={24}/>
              </div>
            )}
            {!this.activeRows.editors && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'editors')}>
                <IcoN name="pencil24" size={24}/>
              </div>
            )}
            {!this.activeRows.labels && (
              <div className={style.taskBinderButton} onClick={this.enableRow.bind(this, 'labels')}>
                <IcoN name="tag24" size={24}/>
              </div>
            )}
          </div>
        )}
        {/* hidden input for attachment upload */}
        <input ref={this.referenceFile} id="myFile" type="file" onChange={this.upload} style={{display: 'none'}}/>
      </div>
    );
  }
}

/**
 * @const mapStateToProps
 * @desc Provides the required parts of store through the component props
 * @param {any} store
 * @param {IOwnProps} ownProps
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  task: ownProps.task,
  currentTask: store.app.currentTask,
  tasks: store.app.tasks,
  user: store.app.user,
  routeParams: ownProps.routeParams,
});

/**
 * @desc Provides the actions that updates store through the component props
 * @const mapDispatchToProps
 * @param {any} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  setTasks: (tasks: ITask[]) => (dispatch(setTasks(tasks))),
  setCurrentTask: (task: ITask) => (dispatch(setCurrentTask(task))),
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTask);
