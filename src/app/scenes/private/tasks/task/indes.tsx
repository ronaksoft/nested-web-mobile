// import * as React from 'react';
// import ITask from 'api/task/interfaces/ITask';
// import {IcoN, UserAvatar, FullName, Loading, RTLDetector, AddLabel,
//   LabelChips, Scrollable} from 'components';
// // import TimeUntiles from 'services/utils/time';
// import TaskApi from 'api/task/index';
// import {connect} from 'react-redux';
// import {setCurrentTask, setTasks} from '../../../../redux/app/actions/index';
// // import CommentsBoard from '../comment/index';
// import {hashHistory, Link} from 'react-router';
// import {IUser} from 'api/interfaces';
// import {difference} from 'lodash';
// const style = require('./task.css');
// const styleNavbar = require('components/navbar/navbar.css');
// // const privateStyle = require('scenes/private/private.css');

// /**
//  * @interface IOwnProps
//  * @desc The component owned properties
//  */
// interface IOwnProps {
//   /**
//    * @prop post
//    * @desc A post model
//    * @type {ITask}
//    * @memberof IOwnProps
//    */
//   task?: ITask;
//   /**
//    * @prop routeParams
//    * @desc The parameters are given by React Router
//    * @type {*}
//    * @memberof IOwnProps
//    */
//   routeParams?: any;
// }

// /**
//  * @interface IProps
//  * @desc The component properties including the owned and the props are provided by route and redux
//  */
// interface IProps {
//   task: ITask;
//   /**
//    * @prop post
//    * @desc A post model
//    * @type {ITask}
//    * @memberof IProps
//    */
//   currentTask: ITask;
//   /**
//    * @prop posts
//    * @desc The stored posts which are given by redux
//    * @type {ITask[]}
//    * @memberof IProps
//    */
//   tasks: ITask[];
//   /**
//    * @prop routeParams
//    * @desc The parameters which are provided by React Router
//    * @type {*}
//    * @memberof IProps
//    */
//   routeParams: any;
//   /**
//    * @prop setPosts
//    * @desc Updates posts in store
//    * @memberof IProps
//    */
//   setTasks: (tasks: ITask[]) => {};
//   /**
//    * @prop setCurrentPost
//    * @desc Updates the last post in store
//    * @memberof IProps
//    */
//   setCurrentTask: (post: ITask) => {};
//   /**
//    * @prop user
//    * @desc Current loggedin user
//    * @memberof IProps
//    */
//   user: IUser;
// }

// /**
//  * @interface IState
//  * @desc Interface of the component state
//  */
// interface IState {
//   /**
//    * @prop post
//    * @memberof IState
//    */
//   task?: ITask | null;
//   /**
//    * @prop showMoreOptions
//    * @memberof IState
//    */
//   showMoreOptions: boolean;
//   /**
//    * @prop showAddLabel
//    * @memberof IState
//    */
//   showAddLabel: boolean;
// }

// /**
//  * @class Post
//  * @extends {React.Component<IProps, IState>}
//  * @desc A post-card component
//  */
// class Task extends React.Component<IProps, IState> {
//   private TaskApi: TaskApi;
//   /**
//    * define inProgress flag
//    * @property {boolean} inProgress
//    * @memberof Post
//    */
//   private inProgress: boolean;

//   /**
//    * Subject RTL flag for RTL mails
//    */
//   private subjectRtl: boolean;

//   /**
//    * body RTL flag for RTL mails
//    */
//   private descriptionRtl: boolean;

//   private scrollRef: any;

//   /**
//    * Creates an instance of Post.
//    * @param {IProps} props
//    * @memberof Post
//    */
//   constructor(props: IProps) {
//     super(props);
//     this.inProgress = false;
//     this.state = {
//       task: this.props.task,
//       showMoreOptions: false,
//       showAddLabel: false,
//     };
//   }

//   /**
//    * @function componentDidMount
//    * @desc Uses the provided post in props or asks server to get the post by
//    * the given `postId` parameter in route also Marks the post as read.
//    * @memberof Post
//    * @override
//    */
//   public componentDidMount() {
//     this.TaskApi = new TaskApi();
//     if (this.props.task) {

//       this.subjectRtl = RTLDetector.getInstance().direction(this.props.task.title);
//       this.descriptionRtl = RTLDetector.getInstance().direction(this.props.task.description);
//       this.setState({
//         task: this.props.task ? this.props.task : null,
//       });
//     } else {
//       this.TaskApi.getMany(this.props.routeParams.taskId ? this.props.routeParams.taskId : this.props.task._id)
//         .then((task: ITask) => {
//           this.subjectRtl = RTLDetector.getInstance().direction(task.title);
//           this.descriptionRtl = RTLDetector.getInstance().direction(task.description);
//           this.setState({
//             task,
//           });
//         });

//       // scroll top to clear previous page scroll
//     //   window.scrollTo(0, 0);
//     }

//   }

//   private removeLabel(id: string) {
//     this.TaskApi.removeLabel(this.state.task._id, id);
//   }

//   private addLabel(id: string) {
//     this.TaskApi.addLabel(this.state.task._id, id);
//   }

//   /**
//    * @function componentWillUnmount
//    * remove event listeners on this situation
//    * @override
//    * @memberOf Post
//    */
//   public componentWillUnmount() {
//   }

//   /**
//    * @func componentWillReceiveProps
//    * @desc Replaces the post in the component state with the new post in received props
//    * @param {IProps} newProps
//    * @memberof Post
//    * @override
//    */
//   public componentWillReceiveProps(newProps: IProps) {
//     if (this.props.task) {
//       this.setState({
//         task: newProps.task ? newProps.task : null,
//       });
//     }
//   }

//   /**
//    * @func updatePostsInStore
//    * @desc Updates a post property and replaces the post in store's posts
//    * @private
//    * @param {string} key
//    * @param {*} value
//    * @memberof Post
//    */
//   public updateTasksInStore(key: string, value: any) {

//     const tasks = JSON.parse(JSON.stringify(this.props.tasks));
//     let newTasks;
//     if (!Array.isArray(tasks)) {
//       return;
//     }
//     newTasks = tasks.map((post: ITask) => {
//       if (post._id === this.state.task._id) {
//         tasks[key] = value;
//       }
//       return post;
//     });

//     this.props.setTasks(newTasks);

//     if (this.props.currentTask) {
//       this.props.setCurrentTask(this.props.currentTask);
//     }
//   }

//   /**
//    * @func leave
//    * @desc Routes to the previous page
//    * @private
//    * @memberof Post
//    */
//   private leave() {
//     hashHistory.goBack();
//   }

//   private toggleMoreOpts = () => {
//     this.setState({
//       showMoreOptions: !this.state.showMoreOptions,
//     });
//   }

//   private toggleAddLAbel = () => {
//     this.setState({
//       showMoreOptions: false,
//       showAddLabel: !this.state.showAddLabel,
//     });
//   }

//   private doneAddLabel = (labels) => {
//     const removeItems = difference(this.state.task.labels, labels);
//     const addItems = difference(labels, this.state.task.labels);
//     this.toggleAddLAbel();
//     removeItems.forEach((element) => {
//       this.removeLabel(element._id);
//     });
//     addItems.forEach((element) => {
//       this.addLabel(element._id);
//     });
//     const task: ITask = this.state.task;
//     task.labels = labels;
//     this.setState({
//         task,
//     });
//   }

//   private scrollRefHandler = (value) => {
//     this.scrollRef = value;
//   }

//   public componentDidUpdate() {
//   }

//   public newCommentReceived = () => {
//     this.scrollRef.scrollDown();
//   }

//   public resizeIframe = (obj) => {
//       try {
//         if (obj.contentWindow) {
//           obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
//         } else {
//           this.resizeIframe(obj);
//         }
//       } catch (error) {
//         console.log(error);
//       }
//   }

//   /**
//    * @func render
//    * @desc Renders the component
//    * @returns
//    * @memberof Post
//    * @generator
//    */
//   public render() {
//     const postView = !this.props.task;
//     if (!this.state.task) {
//       return <Loading active={true} position="absolute"/>;
//     }

//     const {task} = this.state;

//     // Checks the sender is external mail or not
//     return (
//       <div className={[style.postCard, !this.props.task ? style.postView : null].join(' ')}>
//         {/* specefic navbar for post view */}
//         {postView && (
//           <div className={styleNavbar.navbar}>
//             <a onClick={this.leave}>
//               <IcoN size={24} name="xcross24"/>
//             </a>
//             <div className={styleNavbar.filler}/>
//             <a onClick={this.toggleMoreOpts}>
//               <IcoN size={24} name="more24"/>
//             </a>
//           </div>
//         )}
//         {this.state.showMoreOptions && (
//           <div className={[style.postOptions, style.opened].join(' ')}>
//             <ul>
//               <li>
//                 <IcoN size={16} name={'label16'}/>
//                 <a onClick={this.toggleAddLAbel}>Labels</a>
//                 <p>{this.state.task.labels.length}</p>
//               </li>
//               <li className={style.hr}/>
//               <li>
//                 <IcoN size={16} name={'reply16'}/>
//                 <Link to={`/reply/${task._id}`}>Reply</Link>
//               </li>
//             </ul>
//           </div>
//         )}
//         {this.state.showMoreOptions &&
//           <div onClick={this.toggleMoreOpts} className={style.overlay}/>
//         }
//         <Scrollable active={true} ref={this.scrollRefHandler}>
//         </Scrollable>
//         {this.state.showAddLabel && (
//           <AddLabel labels={task.labels} onDone={this.doneAddLabel} onClose={this.toggleAddLAbel}/>
//         )}
//       </div>
//     );
//   }
// }

// /**
//  * @const mapStateToProps
//  * @desc Provides the required parts of store through the component props
//  * @param {any} store
//  * @param {IOwnProps} ownProps
//  */
// const mapStateToProps = (store, ownProps: IOwnProps) => ({
//   task: ownProps.task,
//   currentTask: store.app.currentTask,
//   tasks: store.app.tasks,
//   user: store.app.user,
//   routeParams: ownProps.routeParams,
// });

// /**
//  * @desc Provides the actions that updates store through the component props
//  * @const mapDispatchToProps
//  * @param {any} dispatch
//  */
// const mapDispatchToProps = (dispatch) => ({
//   setTasks: (tasks: ITask[]) => (dispatch(setTasks(tasks))),
//   setCurrentTask: (task: ITask) => (dispatch(setCurrentTask(task))),
// });

// export default connect(mapStateToProps, mapDispatchToProps)(Task);
