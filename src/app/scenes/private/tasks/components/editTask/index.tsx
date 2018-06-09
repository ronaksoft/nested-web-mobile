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
import {IcoN, Loading, Scrollable, RTLDetector, TaskIcon, AttachmentUploader,
  UserAvatar, FullName, Suggestion, CommentsBoard} from 'components';
import TaskApi from '../../../../../api/task/index';
import {connect} from 'react-redux';
import {setCurrentTask, setTasks} from '../../../../../redux/app/actions/index';
import {hashHistory} from 'react-router';
// import {hashHistory, Link} from 'react-router';
import C_TASK_STATE from 'api/task/consts/taskStateConst';
import {IUser} from 'api/interfaces';
import {IChipsItem} from 'components/Chips';
import C_TASK_STATUS from 'api/consts/CTaskStatus';
import C_TASK_ACCESS from 'api/consts/CTaskAccess';
import statuses from 'api/consts/CTaskProgressTask';
import {some, differenceBy, cloneDeep} from 'lodash';
import TimeUtiles from 'services/utils/time';
import {setCurrentAttachment, setCurrentAttachmentList} from 'redux/attachment/actions/index';

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
  setCurrentAttachment: (attachment) => void;
  setCurrentAttachmentList: (attachments) => void;
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
  newTodo: string;
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
  private removeTodoProcess: boolean = false;
  private access: any = {};
  private activeRows: any = {
    date: false,
    description: false,
    todos: false,
    attachments: false,
    watchers: false,
    editors: false,
    labels: false,
  };
  private activeRowsClone = {};
  private updatePromises = [];
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
  private watchersSuggestionComponent: Suggestion;
  private editorsSuggestionComponent: Suggestion;
  private labelsSuggestionComponent: Suggestion;
  /**
   * @prop attachments
   * @desc Reference of `AttachmentUploader` component
   * @private
   * @type {AttachmentUploader}
   * @memberof Compose
   */
  private attachments: any;

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
      newTodo: '',
    };
  }

  // private updateLabels = (labels) => {
  //   const removeItems = difference(this.state.task.labels, labels);
  //   const addItems = difference(labels, this.state.task.labels);
  //   removeItems.forEach((element) => {
  //     this.removeLabel(element._id);
  //   });
  //   addItems.forEach((element) => {
  //     this.addLabel(element._id);
  //   });
  //   const task: ITask = this.state.task;
  //   task.labels = labels;
  //   this.setState({
  //       task,
  //   });
  // }

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
    const obj = {};
    for (const k in C_TASK_ACCESS) {
      if (task) {
        obj[k] = task.access.indexOf(C_TASK_ACCESS[k]) > -1;
      } else {
        obj[k] = false;
      }
    }
    this.access = obj;
    console.log(this.access);
    if (this.access.UPDATE_TASK) {
      this.editMode = true;
      this.createMode = false;
      this.viewMode = false;
    }
    if (this.access.PICK_TASK) {
      this.editMode = true;
      this.createMode = false;
      this.viewMode = false;
    }
    this.originalTask = cloneDeep(task);
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
    this.activeRowsClone = cloneDeep(this.activeRows);
  }

  public enableRow(row: string) {
    this.activeRows[row] = true;
    this.startedEditing = true;
    const task = this.state.task;
    if (!task.todos) {
      task.todos = [];
      this.setState({
        task,
      });
    } else {
      this.forceUpdate();
    }
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
    this.startedEditing = false;
    this.activeRows = cloneDeep(this.activeRowsClone);
    this.closeSuggestions();
    if (this.pristineForm) {
      return this.forceUpdate();
    }
    this.pristineForm = true;
    this.loadSuggestions(this.originalTask);
    this.setState({
      task: cloneDeep(this.originalTask),
    });
  }

  private saveTask = () => {
    this.startedEditing = false;
    this.setState({
      Loading: true,
    });
    if (this.state.newTodo.length > 0) {
      this.newTodo();
    }
    this.closeSuggestions();
    this.updateTaskMain();
    this.updateCandidates(this.state.task.candidates);
    this.updateTodos(this.state.task.todos);
    this.updateWatchers(this.state.task.watchers);
    this.updateEditors(this.state.task.editors);
    this.updateLabels(this.state.task.labels);
    if (this.attachments) {
      this.updateAttachments(this.attachments.get().map((i) => i.model));
    }
    Promise.all(this.updatePromises).then((values) => {
      this.originalTask = cloneDeep(this.state.task);
      console.log(values);
      this.updatePromises = [];
    }).catch(console.log);
    this.activeRowsClone = cloneDeep(this.activeRows);
  }

  private loadSuggestions = (task: ITask) => {
    this.assigneSuggestionComponent.load([task.assignee]);
    if (this.watchersSuggestionComponent) {
      this.watchersSuggestionComponent.load(task.watchers);
    }
    if (this.editorsSuggestionComponent) {
      this.editorsSuggestionComponent.load(task.editors);
    }
    if (this.labelsSuggestionComponent) {
      this.labelsSuggestionComponent.load(task.labels);
    }

  }

  private closeSuggestions = () => {
    try {
      this.assigneSuggestionComponent.clearSuggests();
      this.watchersSuggestionComponent.clearSuggests();
      this.editorsSuggestionComponent.clearSuggests();
      this.labelsSuggestionComponent.clearSuggests();
    } catch (e) {
      this.assigneSuggestionComponent.clearSuggests();
    }
  }

  private startEdit = () => {
    this.startedEditing = true;
    this.forceUpdate();
  }

  private timeOnChange = (event) => {
    this.pristineForm = false;
    const task = this.state.task;

    if (event.target.value === '') {
      task.due_data_has_clock = false;
    } else {
      const date = TimeUtiles.DateUpdateTime(task.due_date, event.target.value);
      task.due_data_has_clock = true;
      task.due_date = date;
    }
    this.setState({
      task,
    });
  }

  private dateOnChange = (event) => {
    this.pristineForm = false;
    const date = TimeUtiles.DateGet(event.target.value);
    const task = this.state.task;
    const time = TimeUtiles.getDateTime(task.due_date);
    const dueDate = TimeUtiles.addDateTime(time, date);
    task.due_date = parseInt(dueDate, 10);
    this.setState({
      task,
    });
  }

  private updateTaskMain = () => {
    const task = this.state.task;
    const updateObj: any = {
      task_id: task._id,
    };
    if (task.title !== this.originalTask.title) {
      updateObj.title = task.title;
    }
    if (task.description !== this.originalTask.description) {
      updateObj.desc = task.description;
    }
    if (task.due_date !== this.originalTask.due_date) {
      updateObj.due_date = task.due_date;
      // if (task.due_data_has_clock !== this.originalTask.due_data_has_clock) {
        updateObj.due_data_has_clock = task.due_data_has_clock;
      // }
    }
    if (Object.keys(updateObj).length > 1) {
      this.TaskApi.update(updateObj);
    }
  }

  private updateTodos = (todos) => {
    const oldData = this.originalTask;
    const newItems = differenceBy(todos, oldData.todos, '_id');
    const removedItems = differenceBy(oldData.todos, todos, '_id');

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.addTodo(this.state.task._id, item.txt));
      });
    }

    if (removedItems.length > 0) {
      removedItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.removeTodo(this.state.task._id, item._id));
      });
    }
  }

  private updateAttachments = (attachments) => {
    const oldData = this.originalTask;
    const newItems = differenceBy(attachments, oldData.attachments, '_id');
    const removedItems = differenceBy(oldData.attachments, attachments, '_id');
    if (newItems.length > 0) {
      newItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.attach(this.state.task._id, item._id));
      });
    }

    if (removedItems.length > 0) {
      removedItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.removeAttachment(this.state.task._id, item._id));
      });
    }
  }

  private updateWatchers = (watchers) => {
    const oldData = this.originalTask;
    const newItems = differenceBy(watchers, oldData.watchers, '_id');
    const removedItems = differenceBy(oldData.watchers, watchers, '_id');

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.addWatcher(this.state.task._id, item._id));
      });
    }

    if (removedItems.length > 0) {
      removedItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.removeWatcher(this.state.task._id, item._id));
      });
    }
  }

  private updateEditors = (editors) => {
    const oldData = this.originalTask;
    const newItems = differenceBy(editors, oldData.editors, '_id');
    const removedItems = differenceBy(oldData.editors, editors, '_id');

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.addEditor(this.state.task._id, item._id));
      });
    }

    if (removedItems.length > 0) {
      removedItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.removeEditor(this.state.task._id, item._id));
      });
    }
  }

  private updateLabels = (labels) => {
    const oldData = this.originalTask;
    const newItems = differenceBy(labels, oldData.labels, '_id');
    const removedItems = differenceBy(oldData.labels, labels, '_id');

    if (newItems.length > 0) {
      newItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.addLabel(this.state.task._id, item._id));
      });
    }

    if (removedItems.length > 0) {
      removedItems.forEach((item) => {
        this.updatePromises.push(this.TaskApi.removeLabel(this.state.task._id, item._id));
      });
    }
  }

  private updateCandidates = (candidates) => {
    if (candidates) {
      this.updatePromises.push(
        this.TaskApi.updateAssignee(
          this.state.task._id,
          candidates.map((user) => user._id).join(','),
        ),
      );
    }
    // const oldData = this.originalTask;
    // const newItems = differenceBy(candidates, oldData.candidates, '_id');
    // const removedItems = differenceBy(oldData.candidates, candidates, '_id');
    // if (candidates.length === 1 && oldData.assignee._id !== candidates[0]._id) {
    //   this.updatePromises.push(this.TaskApi.updateAssignee(this.state.task._id, candidates[0]._id));
    // } else if (candidates.length > 1) {
    //   if (newItems.length > 0) {
    //     newItems.forEach((item) => {
    //       console.log(item);
    //       this.updatePromises.push(this.TaskApi.addCandidate(this.state.task._id, item._id));
    //       // .then((res) => {
    //       //   if (res.accepted_candidates && res.accepted_candidates[0] == item._id) {
    //       //     // message.success
    //       //   }
    //       // });
    //     });
    //   }
    //   if (removedItems.length > 0) {
    //     removedItems.forEach((item) => {
    //       this.updatePromises.push(this.TaskApi.removeCandidate(this.state.task._id, item._id));
    //     });
    //   }
    // }

  }

  private checkTodo = (index, event) => {
    event.nativeEvent.preventDefault();
    const target = event.target;
    const task = this.state.task;
    const isChecked: boolean = !task.todos[index].done;
    this.TaskApi.updateTodo({
      done: isChecked,
      task_id: task._id,
      todo_id: task.todos[index]._id,
    }).then(() => {
      task.todos[index].done = isChecked;
      target.checked = isChecked;
      this.originalTask.todos[index].done = isChecked;
    }).catch(() => {
      task.todos[index].done = !isChecked;
    });
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

  private todoKeyDown = (index, event) => {
    const task = this.state.task;
    if (event.which === 8 && task.todos[index].txt.length === 0 && !this.removeTodoProcess) {
      this.removeTodoProcess = true;
      this.TaskApi.removeTodo(task._id, task.todos[index]._id + '').then(() => {
        const todos = this.state.task.todos;
        todos.splice(index, 1);
        this.setState({
          task,
        }, () => {
          this.removeTodoProcess = false;
        });
      });
    }
    // else if (event.which === 13 && task.todos[index].txt.length > 0) {
    //   const todos = this.state.task.todos;
    //   todos.splice(index + 1, 0, {
    //     weight: 1,
    //     done: false,
    //     _id: task.todos.length + 2,
    //     txt: '',
    //   });
    //   this.setState({
    //     task,
    //   });
    //   event.target.blur();
    // }
  }
  private newTodoKeyUp = (event) => {
    this.pristineForm = false;
    if (event.which === 13) {
      this.newTodo();
    }
  }
  private newTodoOnChange = (event) => {
    this.setState({
      newTodo: event.target.value,
    });
  }
  private newTodo = () => {
    if (this.state.newTodo.length === 0) {
      return;
    }
    const task = this.state.task;
    task.todos.push({
      weight: 1,
      done: false,
      _id: task.todos.length + 2,
      txt: this.state.newTodo,
    });
    return this.setState({
      task,
      newTodo: '',
    });
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
   * @param {IChipsItem[]} items
   */
  private handleAssigneChanged = (items: IChipsItem[]) => {
    this.pristineForm = false;
    const task = this.state.task;
    task.candidates = items;
    this.setState({
      task,
    });
  }
  private handleWatchersChanged = (items: IChipsItem[]) => {
    this.pristineForm = false;
    const task = this.state.task;
    task.watchers = items;
    this.setState({
      task,
    });
  }
  private handleEditorsChanged = (items: IChipsItem[]) => {
    this.pristineForm = false;
    const task = this.state.task;
    task.editors = items;
    this.setState({
      task,
    });
  }
  private handleLabelsChanged = (items) => {
    this.pristineForm = false;
    const task = this.state.task;
    task.labels = items;
    this.setState({
      task,
    });
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
    this.attachments.upload(e, this.mediaMode);
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
   * @func handleAttachmentsChange
   * @desc Updates the component state with a new list of attachments
   * @private
   * @memberof Compose
   * @param {IAttachment[]} items
   */
  private handleAttachmentsChange = (items) => {
    if (!this.startedEditing) {
      const task = this.state.task;
      this.updateAttachments(items);
      task.attachments = items;
      this.setState({
        task,
      });
      this.originalTask.attachments = items;
    } else {
      this.pristineForm = false;
      this.forceUpdate();
    }
  }

  /**
   * @func referenceAttachments
   * @desc Keeps reference of AttachmentUploader component
   * @private
   * @memberof Compose
   * @param {AttachmentUploader} value
   */
  private referenceAttachments = (value: any) => {
    console.log(value);
    this.attachments = value;
  }

  /**
   * @func referenceTargets
   * @desc Keeps reference of Suggestion component
   * @private
   * @memberof Compose
   * @param {Suggestion} value
   */
  private referenceTargets = (input: string, value: Suggestion) => {
    if (input === 'assignes') {
      this.assigneSuggestionComponent = value;
    } else if (input === 'watchers') {
      this.watchersSuggestionComponent = value;
    } else if (input === 'editors') {
      this.editorsSuggestionComponent = value;
    } else if (input === 'labels') {
      this.labelsSuggestionComponent = value;
    }
  }
  private deleteTask = () => {
    this.TaskApi.remove(this.state.task._id).then(() => {
      this.leave();
    });
  }
  private setStatus = (state: number) => {
    const task = this.state.task;
    this.TaskApi.setState(this.state.task._id, C_TASK_STATE[state]).then(() => {
      let newStatus;
      if (state === C_TASK_STATE.complete) {
        newStatus = C_TASK_STATUS.COMPLETED;
      }
      if (state === C_TASK_STATE.failed) {
        newStatus = C_TASK_STATUS.FAILED;
      }
      if (state === C_TASK_STATE.hold) {
        newStatus = C_TASK_STATUS.HOLD;
      }
      if (state === C_TASK_STATE.in_progress) {
        newStatus = C_TASK_STATUS.ASSIGNED;
      }
      task.status = newStatus;
      this.setState({task});
    });
  }

  private openAttachment = (attachment) => {
    this.props.setCurrentTask(this.props.task);
    this.props.setCurrentAttachment(attachment);
    this.props.setCurrentAttachmentList(this.attachments.get().map((i) => i.model));
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
    if (!task) {
      return <Loading active={true} position="absolute"/>;
    }

    let selectedItemsForAssigne = [];
    if (task.assignee) {
      selectedItemsForAssigne = [task.assignee];
    } else if (task.candidates) {
      selectedItemsForAssigne = task.candidates;
    }

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
      case C_TASK_STATUS.NO_ASSIGNED:
        taskStatus = statuses.NOT_ASSIGNED;
        break;
      case C_TASK_STATUS.ASSIGNED:
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
      case C_TASK_STATUS.CANCELED:
        taskStatus =  statuses.CANCELED;
        break;
      case C_TASK_STATUS.REJECTED:
        taskStatus =  statuses.REJECTED;
        break;
      case C_TASK_STATUS.COMPLETED:
        taskStatus =  statuses.COMPLETED;
        break;
      case C_TASK_STATUS.HOLD:
        taskStatus =  statuses.HOLD;
        break;
      case C_TASK_STATUS.OVERDUE:
        taskStatus =  statuses.OVERDUE;
        break;
      case C_TASK_STATUS.FAILED:
        taskStatus =  statuses.FAILED;
        break;
    }

    const isHold = task.status === C_TASK_STATUS.HOLD;
    const isCompleted = task.status === C_TASK_STATUS.COMPLETED;
    const isFailed = task.status === C_TASK_STATUS.FAILED;
    const isInProgress = !(isHold || isCompleted || isFailed);
    const someRowNotBinded = some(Object.keys(this.activeRows), (rowKey) => !this.activeRows[rowKey]);
    return (
      <div className={[style.taskView, !this.props.task ? style.postView : null].join(' ')}>
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
        {this.state.showMoreOptions && (
          <div className={[style.postOptions, style.opened].join(' ')}>
            <ul>
              <li className={isInProgress ? 'active' : ''}
                onClick={this.setStatus.bind(this, C_TASK_STATE.in_progress)}>
                <IcoN size={16} name={'taskInProgress16'}/>
                <a>In Progress</a>
                {isInProgress && <IcoN size={16} name={'heavyCheck16'}/>}
              </li>
              <li className={isHold ? 'active' : ''} onClick={this.setStatus.bind(this, C_TASK_STATE.hold)}>
                <IcoN size={16} name={'taskHold16'}/>
                <a>Hold</a>
                {isHold && <IcoN size={16} name={'heavyCheck16'}/>}
              </li>
              <li className={isCompleted ? 'active' : ''} onClick={this.setStatus.bind(this, C_TASK_STATE.complete)}>
                <IcoN size={16} name={'taskCompleted16'}/>
                <a>Completed</a>
                {isCompleted && <IcoN size={16} name={'heavyCheck16'}/>}
              </li>
              <li className={isFailed ? 'active' : ''} onClick={this.setStatus.bind(this, C_TASK_STATE.failed)}>
                <IcoN size={16} name={'failed16'}/>
                <a>Failed</a>
                {isFailed && <IcoN size={16} name={'heavyCheck16'}/>}
              </li>
              <li className={style.hr}/>
              {/* <li>
                <IcoN size={16} name={'chain16'}/>
                <Link to={`/forward/${task._id}`}>Create a related Task</Link>
              </li> */}
              {task.access.indexOf(C_TASK_ACCESS.DELETE_TASK) > -1 && (
                <li>
                  <IcoN size={16} name={'binRed16'}/>
                  <a onClick={this.deleteTask}>Delete</a>
                </li>
              )}
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
                  <TaskIcon status={taskStatus} progress={progress}/>
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
                  {task.assignee && (!task.candidates || task.candidates.length === 0) &&
                    <UserAvatar user_id={task.assignee._id} borderRadius="24px" size={24}/>}
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
                    <Suggestion ref={this.referenceTargets.bind(this, 'assignes')}
                                mode="user"
                                editable={this.startedEditing || this.createMode}
                                placeholder="Assignees"
                                selectedItems={selectedItemsForAssigne}
                                onSelectedItemsChanged={this.handleAssigneChanged}
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
                      <span>Due time...</span>
                      {this.startedEditing && (
                      <div onClick={this.disableRow.bind(this, 'date')}><IcoN name="binRed16" size={16}/></div>
                      )}
                    </h4>
                    {this.startedEditing && (
                      <ul className={style.setDateTime}>
                        <li>
                            <input type="date" placeholder="Set date..."
                              onChange={this.dateOnChange}
                              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" value={TimeUtiles.Date(task.due_date)}/>
                        </li>
                        <li>
                          <input type="time" placeholder="Set time..." pattern="[0-9]{2}:[0-9]{2}" min="00:00"
                            onChange={this.timeOnChange}
                            value={task.due_data_has_clock ? TimeUtiles.Time(task.due_date) : ''} max="23:59"/>
                        </li>
                      </ul>
                    )}
                    {!this.startedEditing && task.due_date && (
                      <p>
                        <time dateTime={TimeUtiles.Date(task.due_date)}>{TimeUtiles.fullOnlyDate(task.due_date)}</time>
                        <br/>
                        {task.due_data_has_clock && (
                          <time dateTime={TimeUtiles.Time(task.due_date)}>{TimeUtiles.TimeParse(task.due_date)}</time>
                        )}
                      </p>
                    )}
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
                          <input type="checkbox" id={todo._id} defaultChecked={todo.done}
                            onChange={this.checkTodo.bind(this, index)}/>
                          {this.startedEditing && (
                            <label htmlFor={todo._id}>
                              <input type="text" value={todo.txt} onChange={this.todoTextEdit.bind(this, index)}
                                onKeyDown={this.todoKeyDown.bind(this, index)}/>
                            </label>
                          )}
                          {!this.startedEditing && (
                            <label htmlFor={todo._id}>{todo.txt}</label>
                          )}
                        </li>
                      ))}
                      {this.startedEditing && (
                        <li key="newTodo">
                          <input type="checkbox" id="todo1" defaultChecked={false}/>
                          <label htmlFor="todo1">
                            <input type="text" value={this.state.newTodo} onChange={this.newTodoOnChange}
                              placeholder="+ Add a to-do" onKeyUp={this.newTodoKeyUp}/>
                          </label>
                        </li>
                      )}
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
                    {this.access.ADD_ATTACHMENT && (
                      <AttachmentUploader
                        mode="task"
                        editable={this.startedEditing}
                        onItemsChanged={this.handleAttachmentsChange}
                        openAttachment={this.openAttachment}
                        ref={this.referenceAttachments}
                        items={task.attachments || []}
                      />
                    )}
                  </div>
                </div>
              )}
              {this.activeRows.watchers && (
                <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                  <div className={style.taskRowIcon}>
                  <IcoN name="person16" size={16}/>
                  </div>
                  <div className={[style.taskRowItem, style.vertical].join(' ')}>
                    <h4>
                      <span>Watchers</span>
                      {this.startedEditing && (
                        <div onClick={this.disableRow.bind(this, 'watchers')}>
                          <IcoN name="binRed16" size={16}/>
                        </div>
                      )}
                    </h4>
                    <Suggestion ref={this.referenceTargets.bind(this, 'watchers')}
                                mode="user"
                                editable={(this.startedEditing && this.access.ADD_WATCHER) || this.createMode}
                                placeholder="Add peoples who wants to follow task..."
                                selectedItems={task.watchers}
                                onSelectedItemsChanged={this.handleWatchersChanged}
                    />
                  </div>
                </div>
              )}
              {this.activeRows.editors && (
                <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                  <div className={style.taskRowIcon}>
                  <IcoN name="pencil16" size={16}/>
                  </div>
                  <div className={[style.taskRowItem, style.vertical].join(' ')}>
                    <h4>
                      <span>Editors</span>
                      {this.startedEditing && (
                      <div onClick={this.disableRow.bind(this, 'editors')}><IcoN name="binRed16" size={16}/></div>
                      )}
                    </h4>
                    <Suggestion ref={this.referenceTargets.bind(this, 'editors')}
                                mode="user"
                                editable={(this.startedEditing && this.access.ADD_EDITOR) || this.createMode}
                                placeholder="Add peoples who wants to edit task..."
                                selectedItems={task.editors}
                                onSelectedItemsChanged={this.handleEditorsChanged}
                    />
                  </div>
                </div>
              )}
              {this.activeRows.labels && (
                <div className={[style.taskRow, style.rowWithSuggest].join(' ')}>
                  <div className={style.taskRowIcon}>
                  <IcoN name="tag16" size={16}/>
                  </div>
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
                      <Suggestion ref={this.referenceTargets.bind(this, 'labels')}
                                  mode="label"
                                  editable={(this.startedEditing && this.access.ADD_LABEL) || this.createMode}
                                  placeholder="Add labels..."
                                  selectedItems={task.labels}
                                  onSelectedItemsChanged={this.handleLabelsChanged}
                      />
                    </div>
                  )}
                </div>
              )}
              {this.access.COMMENT && !this.startedEditing && (
                <CommentsBoard no_comment={false}
                  task={this.state.task}
                  user={this.props.user}/>
                )}
              <div className={privateStyle.bottomSpace}/>
            </div>
          </div>
        </Scrollable>
        {(this.startedEditing || this.createMode) && someRowNotBinded && (
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
  setCurrentAttachment: (attach) => {
    dispatch(setCurrentAttachment(attach));
  },
  setCurrentAttachmentList: (attachs) => {
    dispatch(setCurrentAttachmentList(attachs));
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(EditTask);
