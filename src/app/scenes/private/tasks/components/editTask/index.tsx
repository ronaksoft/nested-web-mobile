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
import {IcoN, Loading} from 'components';
import TaskApi from '../../../../../api/task/index';
import {connect} from 'react-redux';
import {setCurrentTask, setTasks} from '../../../../../redux/app/actions/index';
import {hashHistory, Link} from 'react-router';
import IUser from '../../../../../api/account/interfaces/IUser';
// import {difference} from 'lodash';
const style = require('../../task.css');
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
}

/**
 * @class EditTask
 * @extends {React.Component<IProps, IState>}
 * @desc A task-viw component
 */
class EditTask extends React.Component<IProps, IState> {
  private TaskApi: TaskApi;
  /**
   * define inProgress flag
   * @property {boolean} inProgress
   * @memberof Post
   */
  private inProgress: boolean;

  /**
   * @prop htmlBodyRef
   * @desc Reference of html email body element
   * @private
   * @type {HTMLDivElement}
   * @memberof Compose
   */
  private htmlBodyRef: HTMLDivElement;

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
    };
  }

  /**
   * @prop scrollWrapper
   * @desc Reference of  scroll element
   * @private
   * @type {HTMLDivElement}
   * @memberof Feed
   */
  private scrollWrapper: HTMLDivElement;

  private refScrollHandler = (value) => {
    this.scrollWrapper = value;
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

      this.setState({
        task: this.props.task ? this.props.task : null,
      });
    } else {
      this.TaskApi.getMany(this.props.task._id)
        .then((task: ITask) => {
          this.setState({
            task,
          });
        });

      // scroll top to clear previous page scroll
      window.scrollTo(0, 0);
    }

    setTimeout( () => {
      this.loadBodyEv(this.htmlBodyRef);
    }, 300);

  }
  /**
   * @function componentWillUnmount
   * remove event listeners on this situation
   * @override
   * @memberOf Post
   */
  public componentWillUnmount() {
    // this.htmlBodyRef.removeEventListener('DOMSubtreeModified');
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

  // /**
  //  * @func updatePostsInStore
  //  * @desc Updates a post property and replaces the post in store's posts
  //  * @private
  //  * @param {string} key
  //  * @param {*} value
  //  * @memberof Post
  //  */
  // private updateTasksInStore(key: string, value: any) {

  //   const tasks = JSON.parse(JSON.stringify(this.props.tasks));
  //   let newTasks;
  //   newTasks = tasks.map((task: ITask) => {
  //     if (task._id === this.state.task._id) {
  //       task[key] = value;
  //     }
  //     return task;
  //   });

  //   this.props.setTasks(newTasks);

  //   if (this.props.currentTask) {
  //     this.props.setCurrentTask(this.props.currentTask);
  //   }
  // }

  /**
   * @func leave
   * @desc Routes to the previous page
   * @private
   * @memberof EditTask
   */
  private leave() {
    hashHistory.goBack();
  }

  /**
   * @func loadBodyEv
   * @desc Triggers after loading the post body
   *       this function resize the mail body fit into screen
   * @private
   * @event
   * @param {any} e - event
   * @memberof Post
   */
  private loadBodyEv(el: HTMLDivElement) {
    if (!el) {
      return setTimeout( () => {
        this.loadBodyEv(this.htmlBodyRef);
      }, 100);
    }
    const DOMHeight = el.offsetHeight;
    const DOMWidth = el.offsetWidth;
    const ParentDOMHeight = el.parentElement.offsetHeight;
    const delta = ParentDOMHeight - DOMHeight;
    // console.log(ParentDOMHeight, delta);
    const WinWidth = window.screen.width;
    const ratio = WinWidth / DOMWidth;
    if (ratio >= 1 ) {
      return;
    }
    el.style.transform = 'scale(' + ratio + ',' + ratio + ')';
    el.style.webkitTransform = 'scale(' + ratio + ',' + ratio + ')';
    setTimeout( () => {
      const newH = el.getBoundingClientRect().height;
      // console.log(delta, newH);
      el.parentElement.style.height = delta + newH + 'px';
    }, 500);
  }

  private toggleMoreOpts = () => {
    this.setState({
      showMoreOptions: !this.state.showMoreOptions,
    });
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof Post
   * @generator
   */
  public render() {
    if ( this.scrollWrapper && !this.props.task) {
      const isSafari = navigator.userAgent.toLowerCase().match(/(ipad|iphone)/);
      if (isSafari || (isSafari !== null && isSafari.toString().includes('iphone'))) {
        this.scrollWrapper.addEventListener('touchmove', (e: any) => {
          e = e || window.event;
          e.stopImmediatePropagation();
          e.cancelBubble = true;
          e.stopPropagation();
          e.returnValue = true;
          return true;
        }, false);
        this.scrollWrapper.addEventListener('touchstart', (e: any) => {
          e = e || window.event;
          e.currentTarget.scrollTop += 1;
          e.stopImmediatePropagation();
          e.cancelBubble = true;
          e.stopPropagation();
          e.returnValue = true;
          return true;
        }, false);
      }
      this.scrollWrapper.addEventListener('scroll', (e: any) => {
        e = e || window.event;
        const el = e.currentTarget;
        e.stopImmediatePropagation();
        e.cancelBubble = true;
        e.stopPropagation();
        if (el.scrollTop === 0) {
            el.scrollTop = 1;
        } else if (el.scrollHeight === el.clientHeight + el.scrollTop) {
          el.scrollTop -= 1;
        }
        e.returnValue = true;
        return true;
      }, false);
    }
    const taskView = !this.props.task;
    if (!this.state.task) {
      return <Loading active={true}/>;
    }

    const {task} = this.state;

    // Checks the sender is external mail or not
    return (
      <div className={[style.postCard, !this.props.task ? style.postView : null].join(' ')}>
        {/* specefic navbar for post view */}
        {taskView && (
          <div className={styleNavbar.navbar}>
            <a onClick={this.leave}>
              <IcoN size={24} name="xcross24"/>
            </a>
            <div className={styleNavbar.filler}/>
            <a onClick={this.toggleMoreOpts}>
              <IcoN size={24} name="more24"/>
            </a>
          </div>
        )}
        {this.state.showMoreOptions && (
          <div className={[style.postOptions, style.opened].join(' ')}>
            <ul>
              <li>
                <IcoN size={16} name={'forward16'}/>
                <Link to={`/forward/${task._id}`}>Forward</Link>
              </li>
            </ul>
          </div>
        )}
        {this.state.showMoreOptions &&
          <div onClick={this.toggleMoreOpts} className={style.overlay}/>
        }
        <div className={style.postScrollContainer} ref={this.refScrollHandler}>
          <div className={style.postScrollContent}>
            {/* renders the comments and comment input in post view */}
            {/* {!this.props.post && (
              <CommentsBoard no_comment={this.state.post.no_comment}
              post_id={this.state.post._id} post={this.state.post}
              user={this.props.user}/>
            )} */}
           {taskView && <div className={privateStyle.bottomSpace}/>}
          </div>
        </div>
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
