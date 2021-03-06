/**
 * @file scenes/private/posts/components/post/index.tsx
 * @author Sina Hosseini <ehosseiniir@gmail.com>
 * @description A post-card component
 * Documented by:          Soroush Torkzadeh <sorousht@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */

import * as React from 'react';
import IPost from '../../../../../api/post/interfaces/IPost';
import {
  IcoN, UserAvatar, FullName, Loading, RTLDetector, AddLabel,
  AttachPlace, MovePlace, RemovePlace, LabelChips, Scrollable, SeenBy,
} from 'components';
import {IPlace, ILabel, IUser} from 'api/interfaces/';
import TimeUntiles from '../../../../../services/utils/time';
import PostApi from 'api/post/index';
import {connect} from 'react-redux';
import {setCurrentPost} from '../../../../../redux/app/actions/index';
import {postAdd, postUpdate} from '../../../../../redux/posts/actions/index';
import CommentsBoard from 'components/comment/index';
import PostAttachment from '../../../../../components/PostAttachment/index';
import {hashHistory, Link} from 'react-router';
import IAddLabelRequest from 'api/post/interfaces/IAddLabelRequest';
import IRemoveLabelRequest from 'api/post/interfaces/IRemoveLabelRequest';
import IRemovePlaceRequest from 'api/post/interfaces/IRemovePlaceRequest';
import IMovePlaceRequest from 'api/post/interfaces/IMovePlaceRequest';
import IAttachPlaceRequest from 'api/post/interfaces/IAttachPlaceRequest';
import {difference, cloneDeep} from 'lodash';
import {message, Modal} from 'antd';
import * as md5 from 'md5';

const style = require('./post.css');
const styleNavbar = require('../../../../../components/navbar/navbar.css');
const privateStyle = require('../../../private.css');
import CONFIG from '../../../../../config';
import AppApi from '../../../../../api/app';
import SyncPostActions from 'services/sync-post-activity/actions';
import SyncPostActivity from 'services/sync-post-activity';
import {IPostActivity} from 'api/interfaces';
import * as _ from 'lodash';

/**
 * @interface IOwnProps
 * @desc The component owned properties
 */
interface IOwnProps {
  /**
   * @prop post
   * @desc A post model
   * @type {IPost}
   * @memberof IOwnProps
   */
  post?: IPost;
  /**
   * @prop routeParams
   * @desc The parameters are given by React Router
   * @type {*}
   * @memberof IOwnProps
   */
  routeParams?: any;
}

/**
 * @interface IProps
 * @desc The component properties including the owned and the props are provided by route and redux
 */
interface IProps {
  post: IPost;
  /**
   * @prop post
   * @desc A post model
   * @type {IPost}
   * @memberof IProps
   */
  currentPost: IPost;
  /**
   * @prop posts
   * @desc The stored posts which are given by redux
   * @type {IPost[]}
   * @memberof IProps
   */
  posts: IPost[];
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
  postAdd: (post: IPost) => {};
  postUpdate: (post: IPost) => {};
  /**
   * @prop setCurrentPost
   * @desc Updates the last post in store
   * @memberof IProps
   */
  setCurrentPost: (post: IPost) => {};
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
  post?: IPost | null;
  /**
   * @prop showMoreOptions
   * @memberof IState
   */
  showMoreOptions: boolean;
  /**
   * @prop showAddLabel
   * @memberof IState
   */
  showAddLabel: boolean;
  showAttachPlace: boolean;
  showMovePlace: boolean;
  showRemovePlace: boolean;
  showSeenBy: boolean;
  user: IUser;
}

/**
 * @class Post
 * @extends {React.Component<IProps, IState>}
 * @desc A post-card component
 */
class Post extends React.Component<IProps, IState> {
  private PostApi: PostApi;
  private AppApi: AppApi;
  /**
   * define inProgress flag
   * @property {boolean} inProgress
   * @memberof Post
   */
  private inProgress: boolean;
  /**
   * is the component reiszed the post body
   * @property {boolean} inProgress
   * @memberof Post
   */
  private resizedPostBody: boolean;

  /**
   * Subject RTL flag for RTL mails
   */
  private subjectRtl: boolean;

  /**
   * body RTL flag for RTL mails
   */
  private bodyRtl: boolean;

  /**
   * Object of iframe
   */
  private iframeObj: any;

  private syncPostActivity = SyncPostActivity.getInstance();
  private syncActivityListeners = [];

  /**
   * @prop htmlBodyRef
   * @desc Reference of html email body element
   * @private
   * @type {HTMLDivElement}
   * @memberof Compose
   */
  private htmlBodyRef: HTMLDivElement;
  private scrollRef: any;

  /**
   * Creates an instance of Post.
   * @param {IProps} props
   * @memberof Post
   */
  constructor(props: IProps) {
    super(props);
    this.inProgress = false;
    this.resizedPostBody = false;
    this.state = {
      post: this.props.post,
      showMoreOptions: false,
      showAddLabel: false,
      showAttachPlace: false,
      showMovePlace: false,
      showRemovePlace: false,
      showSeenBy: false,
      user: this.props.user,
    };
  }

  /**
   * @function componentDidMount
   * @desc Uses the provided post in props or asks server to get the post by
   * the given `postId` parameter in route also Marks the post as read.
   * @memberof Post
   * @override
   */
  public componentDidMount() {
    this.PostApi = new PostApi();
    this.AppApi = new AppApi();
    if (this.props.post) {
      this.setState({
        post: this.props.post ? this.props.post : null,
      });
      this.applySubjectDirection(this.props.post.subject);
      this.applyBodyDirection(this.props.post.body || this.props.post.preview);
    } else {
      const storedPost = this.props.posts[this.props.routeParams.postId];
      if (storedPost) {
        this.setState({
          post: storedPost,
        });
        this.applySubjectDirection(storedPost.subject);
        this.applyBodyDirection(storedPost.body || storedPost.preview);
      }
      const postId = this.props.routeParams.postId ? this.props.routeParams.postId : this.props.post._id;
      this.PostApi.getPost(postId, true)
        .then((post: IPost) => {
          this.setState({
            post,
          });
          this.applySubjectDirection(post.subject);
          this.applyBodyDirection(post.body);
          if (!post.post_read) {
            post.post_read = true;
            this.updatePostsInStore('post_read', true);
          }
        }).catch((err) => {
        if (err && err.err_code === 3) {
          hashHistory.goBack();
        }
      });

      window.scrollTo(0, 0);

      this.syncActivityListeners.push(
        this.syncPostActivity.openChannel(
          postId,
          SyncPostActions.LABEL_ADD,
          (activity) => {
            this.syncAddLabel(activity);
          },
        ));

      this.syncActivityListeners.push(
        this.syncPostActivity.openChannel(
          postId,
          SyncPostActions.LABEL_REMOVE,
          (activity) => {
            this.syncRemoveLabel(activity);
          },
        ));

      this.syncActivityListeners.push(
        this.syncPostActivity.openChannel(
          postId,
          SyncPostActions.EDITED,
          (activity) => {
            this.syncEditPost(activity);
          },
        ));

      this.syncActivityListeners.push(
        this.syncPostActivity.openChannel(
          postId,
          SyncPostActions.PLACE_ATTACH,
          (activity) => {
            this.syncPlaceAttach(activity);
          },
        ));

      this.syncActivityListeners.push(
        this.syncPostActivity.openChannel(
          postId,
          SyncPostActions.PLACE_MOVE,
          (activity) => {
            this.syncPlaceMove(activity);
          },
        ));
    }

  }

  private updatePost() {
    this.PostApi.getPost(this.state.post._id, true)
    .then((post: IPost) => {
      this.setState({
        post,
      });
    });
  }

  private syncAddLabel(activity: IPostActivity) {
    const post = this.state.post;
    const index =  _.findIndex(post.post_labels, {_id: activity.label._id});
    if (index === -1) {
      post.post_labels.push(activity.label);
      this.setState({
        post,
      });
    }
  }

  private syncRemoveLabel(activity: IPostActivity) {
    const post = this.state.post;
    const index =  _.findIndex(post.post_labels, {_id: activity.label._id});
    if (index > -1) {
      post.post_labels.splice(index, 1);
      this.setState({
        post,
      });
    }
  }

  private syncEditPost(activity: IPostActivity) {
    this.setState({
      post: activity.post,
    });
  }

  private syncPlaceAttach(activity: IPostActivity) {
    const post = this.state.post;
    if (!_.some(post.post_places, {
        id: activity.new_place._id,
      })) {
      post.post_places.push(activity.new_place);
    }
    this.setState({
      post,
    });
  }

  private syncPlaceMove(activity: IPostActivity) {
    const post = this.state.post;
    if (!_.some(post.post_places, {
        id: activity.new_place._id,
      })) {
      post.post_places.push(activity.new_place);
    }
    const index = _.findIndex(post.post_places, {id: activity.old_place._id});
    if (index > -1) {
      post.post_places.splice(index, 1);
    }
    this.setState({
      post,
    });
  }

  private applySubjectDirection = (subject: string = '') => {
    this.subjectRtl = RTLDetector.getInstance().direction(subject);
  }

  private applyBodyDirection = (body: string = '') => {
    this.subjectRtl = RTLDetector.getInstance().direction(body.replace(/<div>/g, ''));
  }

  private removeLabel(id: string) {
    const params: IRemoveLabelRequest = {
      post_id: this.state.post._id,
      label_id: id,
    };
    this.PostApi.removeLabel(params);
  }

  private addLabel(id: string) {
    const params: IAddLabelRequest = {
      post_id: this.state.post._id,
      label_id: id,
    };
    this.PostApi.addLabel(params);
  }

  private removePlace(id: string) {
    const params: IRemovePlaceRequest = {
      post_id: this.state.post._id,
      place_id: id,
    };
    this.PostApi.remove(params);
  }

  private addPlace(id: string) {
    const params: IAttachPlaceRequest = {
      post_id: this.state.post._id,
      place_id: id,
    };
    this.PostApi.addPlace(params);
  }

  /**
   * @function componentWillUnmount
   * remove event listeners on this situation
   * @override
   * @memberOf Post
   */
  public componentWillUnmount() {
    window.removeEventListener('message', this.onIframeMessageHandler);
    this.syncActivityListeners.forEach((item) => {
      if (typeof item === 'function') {
        item();
      }
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
    if (this.props.user) {
      this.setState({
        user: newProps.user,
      });
    }
  }

  /**
   * @func updatePostsInStore
   * @desc Updates a post property and replaces the post in store's posts
   * @private
   * @param {string} key
   * @param {*} value
   * @memberof Post
   */
  private updatePostsInStore(key: string, value: any) {

    const posts = cloneDeep(this.props.posts);
    const post = posts[this.state.post._id];
    if (post) {
      post[key] = value;
      this.props.postUpdate(post);
    }

    if (this.props.currentPost) {
      this.props.setCurrentPost(this.props.currentPost);
    }
  }

  /**
   * @func leave
   * @desc Routes to the previous page
   * @private
   * @memberof Post
   */
  private leave() {
    hashHistory.goBack();
  }

  /**
   * @func postPlaceClick
   * @desc redirects to the clicked place posts
   * @private
   * @param {string} pid - place ID
   * @memberof Post
   */
  private postPlaceClick(pid) {
    hashHistory.push(`/places/${pid}/messages`);
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
      return setTimeout(() => {
        this.loadBodyEv(this.htmlBodyRef);
      }, 100);
    }
    const DOMHeight = el.offsetHeight;
    const DOMWidth = el.offsetWidth;
    const parentDOMHeight = el.parentElement.offsetHeight;
    const delta = parentDOMHeight - DOMHeight;
    // console.log(ParentDOMHeight, delta);
    const WinWidth = window.screen.width;
    const ratio = WinWidth / DOMWidth;
    if (ratio >= 1) {
      return;
    }
    el.style.transform = 'scale(' + ratio + ',' + ratio + ')';
    el.style.webkitTransform = 'scale(' + ratio + ',' + ratio + ')';
    setTimeout(() => {
      const newH = el.getBoundingClientRect().height;
      // console.log(delta, newH);
      el.parentElement.style.height = delta + newH + 'px';
    }, 1500);
    this.resizeFont(el, ratio);
  }

  private resizeFont(el, ratio: number) {
    if (el.innerHTML === el.innerText && el.innerText.length > 0) {
      const fontSize = parseInt(el.style.fontSize, 10);
      const newFontSize = (fontSize > 1 ? fontSize : 14) * (1 / ratio);
      el.style.fontSize = newFontSize < 100 ? newFontSize : 90 + 'px';
    }
    for (const value of el.children) {
      this.resizeFont(value, ratio);
    }
  }

  private toggleMoreOpts = () => {
    this.setState({
      showMoreOptions: !this.state.showMoreOptions,
    });
  }

  private toggleAddLAbel = () => {
    this.setState({
      showMoreOptions: false,
      showAddLabel: !this.state.showAddLabel,
    });
  }

  private doneAddLabel = (labels) => {
    const removeItems = difference(this.state.post.post_labels, labels);
    const addItems = difference(labels, this.state.post.post_labels);
    this.toggleAddLAbel();
    removeItems.forEach((element) => {
      this.removeLabel(element._id);
    });
    addItems.forEach((element) => {
      this.addLabel(element._id);
    });
    const post = this.state.post;
    post.post_labels = labels;
    this.setState({
      post,
    });
  }

  private toggleAttachPlace = () => {
    this.setState({
      showMoreOptions: false,
      showAttachPlace: !this.state.showAttachPlace,
    });
  }

  private doneAttachPlace = (places) => {
    this.toggleAttachPlace();
    this.addPlace(places.map((place) => place._id).join(','));
    // places.forEach((element) => {
    //   this.addPlace(element._id);
    // });
    // const post = this.state.post;
    // post.post_places = places;
    // this.setState({
    //   post,
    // });
  }

  private toggleMovePlace = () => {
    this.setState({
      showMoreOptions: false,
      showMovePlace: !this.state.showMovePlace,
    });
  }

  private toggleRemovePlace = () => {
    this.setState({
      showMoreOptions: false,
      showRemovePlace: !this.state.showRemovePlace,
    });
  }

  private toggleSeenBy = () => {
    this.setState({
      showMoreOptions: false,
      showSeenBy: !this.state.showSeenBy,
    });
  }

  private doneMovePlace = (oldPlace, newPlace) => {
    const params: IMovePlaceRequest = {
      post_id: this.state.post._id,
      old_place_id: oldPlace,
      new_place_id: newPlace,
    };
    this.toggleMovePlace();
    this.PostApi.move(params).then(() => this.updatePost());
  }

  private doneRemovePlace = (RPlaces) => {
    RPlaces.forEach((place) => this.removePlace(place._id));
    this.toggleRemovePlace();
    const post = this.state.post;
    post.post_places = post.post_places.filter((place) => !RPlaces.find((rplace) => rplace._id === place._id));
    this.setState({
      post,
    });
  }

  /**
   * @func refHandler
   * @desc handler for html emails
   * @private
   * @memberof Compose
   * @param {HTMLDivElement} value
   */
  private refHandler = (value) => {
    this.htmlBodyRef = value;
  }
  private scrollRefHandler = (value) => {
    this.scrollRef = value;
  }

  /**
   * @func Pins/Unpins the post and updates the post in store's posts list
   * @private
   * @memberof Post
   */
  private toggleBookmark(event) {
    // arguments[1] is an event
    event.stopPropagation();
    event.preventDefault();
    // change pinned of post
    const post = cloneDeep(this.state.post);
    post.pinned = !post.pinned;
    this.setState({post});

    // create an PostApi and make api call based on post.pinned
    const postApi = new PostApi();
    if (post.pinned) {
      postApi.pinPost(this.state.post._id)
        .then(() => {
          // set action is not in progress
          this.inProgress = false;
          // Update posts in store
          this.updatePostsInStore('pinned', true);
        })
        .catch(() => {
          // roll back if has error in api call
          this.inProgress = false;
          post.pinned = !post.pinned;
          this.setState({post});
        });
    } else {
      postApi.unpinPost(this.state.post._id)
        .then(() => {
          // set action is not in progress
          this.inProgress = false;
          this.updatePostsInStore('pinned', false);
        })
        .catch(() => {
          // set action is not in progress
          this.inProgress = false;

          // roll back if has error in api call
          let post;
          post = this.state.post;
          post.pinned = !post.pinned;
          this.setState({post});
        });
    }
    return false;
  }

  private toggleNotifiction = (event) => {

    const post: IPost = cloneDeep(this.state.post);
    post.watched = event.currentTarget.checked;
    this.setState({post});

    // create an PostApi and make api call based on post.pinned
    const postApi = new PostApi();
    postApi.setNotification(this.state.post._id, event.currentTarget.checked)
    .then(() => {
      // Update posts in store
      this.updatePostsInStore('pinned', true);
    })
    .catch(() => {
      post.watched = !post.watched;
      this.setState({post});
    });
  }

  public componentDidUpdate() {
    if (this.htmlBodyRef && this.htmlBodyRef.querySelectorAll('img').length > 0 && !this.resizedPostBody) {
      this.resizedPostBody = true;
      const images = this.htmlBodyRef.querySelectorAll('img');
      let imagesLoaded = 0;
      let imagesNotLoaded = 0;
      images.forEach((image, index) => {
        if (image.complete) {
          imagesLoaded++;
        } else {
          image.onload = () => {
            imagesLoaded++;
            if (imagesLoaded + imagesNotLoaded === images.length - 1) {
              this.loadBodyEv(this.htmlBodyRef);
            }
          };
          image.onerror = () => {
            imagesNotLoaded++;
            if (imagesLoaded + imagesNotLoaded === images.length - 1) {
              this.loadBodyEv(this.htmlBodyRef);
            }
          };
        }
        if (index === images.length - 1 && imagesLoaded + imagesNotLoaded === images.length - 1) {
          this.loadBodyEv(this.htmlBodyRef);
        }
      });
    }
  }

  public newCommentReceived = () => {
    this.scrollRef.scrollDown();
  }

  public iframeObjHandler = (obj) => {
    setTimeout(() => {
      if (obj && obj.contentWindow) {
        this.iframeObj = obj;
        window.addEventListener('message', this.onIframeMessageHandler);
      }
    }, 100);
  }

  // TODO: hash checksum

  private onIframeMessageHandler = (e) => {
    try {
      if (this.state.post.iframe_url.indexOf(e.origin) === -1) {
        return;
      }
      const data = JSON.parse(e.data);
      if (!this.isHashValid(data)) {
        return;
      }
      if (data.url === this.state.post.iframe_url) {
        const userData = this.getUserData();
        switch (data.cmd) {
          case 'getInfo':
            this.sendIframeMessage('setInfo', userData);
            break;
          case 'setSize':
            this.iframeObj.style.cssText = 'height: ' + data.data.height + 'px !important';
            break;
          case 'setNotif':
            if (['success', 'info', 'warning', 'error'].indexOf(data.data.type) > -1) {
              message[data.data.type](data.data.message);
            }
            break;
          case 'createToken':
            this.AppApi.createToken(data.data.clientId).then((res) => {
              this.sendIframeMessage('setLoginInfo', {
                token: data.data.token,
                appToken: res.token,
                appDomain: userData.app,
                username: userData.userId,
                fname: userData.fname,
                lname: userData.lname,
                email: userData.email,
              });
            }).catch(() => {
              message.warning(`Can not create token for app: ${data.data.clientId}`);
            });
            break;
          default:
            break;
        }
      }
    } catch (e) {
      console.log('cannot parse message', e);
    }
  }

  private getUserData(): any {
    const user = this.props.user;
    const msgId = this.state.post._id;
    const app = CONFIG().DOMAIN;
    return {
      userId: user._id,
      email: user.email,
      fname: user.fname,
      lname: user.lname,
      msgId,
      app,
      locale: 'en-US',
      dark: false,
    };
  }

  private createHash(data) {
    let str = JSON.stringify(data);
    str = encodeURIComponent(str).split('%').join('');
    return md5(str);
  }

  private sendIframeMessage(cmd, data) {
    const msg: any = {
      cmd,
      data,
    };
    const hash = this.createHash(msg);
    msg.hash = hash;
    this.iframeObj.contentWindow.postMessage(JSON.stringify(msg), '*');
  }

  private isHashValid(data) {
    const packetHash = data.hash;
    delete data.hash;
    const hash = this.createHash(data);
    return (hash === packetHash);
  }

  private retract = () => {
    Modal.confirm({
      title: 'Retract',
      content: 'are you sure for retracting this post?',
      cancelText: 'No keep the post',
      okText: 'Yes',
      onCancel: () => {
          // this.props.onClose();
      },
      onOk: () => {
        this.PostApi.retract(this.state.post._id).then(() => hashHistory.goBack());
      },
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
    const postView = !this.props.post;
    if (!this.state.post) {
      return <Loading active={true} position="absolute"/>;
    }
    const {post} = this.state;
    const bookmarkClick = this.toggleBookmark.bind(this);
    const currentUserIsSender = post.sender && this.state.user && post.sender._id === this.state.user._id;

    // Checks the sender is external mail or not
    const sender = post.email_sender ? post.email_sender : post.sender;
    return (
      <div className={[style.postCard, !this.props.post ? style.postView : null].join(' ')}>
        {/* specefic navbar for post view */}
        {postView && (
          <div className={styleNavbar.navbar}>
            <a onClick={this.leave}>
              <IcoN size={24} name="xcross24"/>
            </a>
            <div className={styleNavbar.filler}/>
            <Link to={`/forward/${post._id}`}>
              <IcoN size={24} name="forward24"/>
            </Link>
            <Link to={`/reply/${post._id}`}>
              <IcoN size={24} name="reply24"/>
            </Link>
            <a onClick={this.toggleMoreOpts}>
              <IcoN size={24} name="more24"/>
            </a>
          </div>
        )}
        {this.state.showMoreOptions && (
          <div className={[style.postOptions, style.opened].join(' ')}>
            <ul>
              <li>
                <IcoN size={16} name={'bell16'}/>
                <a>
                  <label htmlFor="notifRecPost">Recieve notifications</label>
                </a>
                <p>
                  <input type="checkbox" id="notifRecPost" name="notifRecPost"
                    onChange={this.toggleNotifiction} checked={post.watched} />
                </p>
              </li>
              <li>
                <IcoN size={16} name={'label16'}/>
                <a onClick={this.toggleAddLAbel}>Labels</a>
                <p>{this.state.post.post_labels.length}</p>
              </li>
              <li className={style.hr}/>
              <li>
                <IcoN size={16} name={'reply16'}/>
                <Link to={`/reply/${post._id}`}>Reply</Link>
              </li>
              <li>
                <IcoN size={16} name={'reply16'}/>
                <Link to={`/reply/${post._id}/sender`}>
                  Reply to "{post.sender ? (post.sender.fname + post.sender.lname) : post.email_sender._id}"
                </Link>
              </li>
              <li>
                <IcoN size={16} name={'forward16'}/>
                <Link to={`/forward/${post._id}`}>Forward</Link>
              </li>
              <li className={style.hr}/>
              {currentUserIsSender && (
                <li onClick={this.toggleAttachPlace}>
                  <IcoN size={16} name={'places16'}/>
                  <a>Attach a Place</a>
                </li>
              )}
              {post.wipe_access && (
                <li>
                  <IcoN size={16} name={'pencil16'}/>
                  <Link to={`/compose/edit/${post._id}`}>Edit</Link>
                </li>
              )}
              {currentUserIsSender && (
                <li onClick={this.toggleSeenBy}>
                  <IcoN size={16} name={'eyeOpen16'}/>
                  <a>Seen by...</a>
                </li>
              )}
              {post.wipe_access && (
                <li onClick={this.retract}>
                  <IcoN size={16} name={'retract16'}/>
                  <a>Retract</a>
                </li>
              )}
              {post.wipe_access && <li className={style.hr}/>}
              <li onClick={this.toggleMovePlace}>
                <IcoN size={16} name={'places16'}/>
                <a>Move from ...</a>
              </li>
              <li onClick={this.toggleRemovePlace}>
                <IcoN size={16} name={'binRed16'}/>
                <a>Remove from ...</a>
              </li>
            </ul>
          </div>
        )}
        {this.state.showMoreOptions &&
        <div onClick={this.toggleMoreOpts} className={style.overlay}/>
        }
        <Scrollable active={postView} ref={this.scrollRefHandler}>
          <div className={style.postScrollContainer}>
            <div className={style.postScrollContent}>
              <div className={style.postHead}>
                <UserAvatar user_id={sender} size={32} borderRadius={'16px'}/>
                {post.reply_to && <IcoN size={16} name={'repliedGreen16'}/>}
                {post.forward_from && <IcoN size={16} name={'forward16Blue'}/>}
                {post.sender && <FullName user_id={post.sender}/>}
                {post.email_sender && (
                  <span>
                    {`${post.email_sender._id}`}
                  </span>
                )}
                <p>
                  {TimeUntiles.dynamic(post.timestamp)}
                </p>
                {!post.post_read && <IcoN size={16} name={'circle8blue'}/>}
                <div className={post.pinned ? style.postPinned : style.postPin}
                     onClick={bookmarkClick}>
                  {post.pinned && <IcoN size={24} name={'bookmark24Force'}/>}
                  {!post.pinned && <IcoN size={24} name={'bookmarkWire24'}/>}
                </div>
              </div>
              {!this.props.post && <hr/>}
              <div className={style.postBody}>
                <h3 className={this.subjectRtl ? style.Rtl : null}>{post.subject}</h3>
                {post.iframe_url && (
                  <iframe src={post.iframe_url} scrolling="auto"
                          ref={this.iframeObjHandler}/>
                )}
                <div dangerouslySetInnerHTML={{__html: post.body || post.preview}}
                     ref={this.refHandler} className={[style.mailWrapper, this.bodyRtl ? style.Rtl : null].join(' ')}/>
                {post.post_attachments.length > 0 && !this.props.post && (
                  <PostAttachment attachments={post.post_attachments}
                                  postId={post._id}
                  />
                )}
                {this.props.post && (
                  <div className={style.postDetails}>
                    {post.post_attachments.length > 0 && (
                      <div>
                        <IcoN size={16} name={'attach16'}/>
                        {post.post_attachments.length}
                        {post.post_attachments.length === 1 && <span> Attachment</span>}
                        {post.post_attachments.length > 1 && <span> Attachments</span>}
                      </div>
                    )}
                    {post.post_labels.length > 0 && (
                      <div>
                        <IcoN size={16} name={'tag16'}/>
                        {post.post_labels.length}
                        {post.post_labels.length === 1 && <span> Label</span>}
                        {post.post_labels.length > 1 && <span> Labels</span>}
                      </div>
                    )}
                  </div>
                )}
                {!this.props.post && (
                  <ul className={style.postLabels}>
                    {post.post_labels.map((label: ILabel, index: number) => {
                      return (
                        <li key={label._id + index}>
                          <LabelChips label={label}/>
                        </li>
                      );
                    })}
                  </ul>
                )}
                <div className={style.postPlaces}>
                  {postView && <a>Shared with:</a>}
                  {post.post_places.map((place: IPlace, index: number) => {
                    if (index < 2) {
                      return (
                        <span key={place._id + 'pl' + index} onClick={this.postPlaceClick.bind(this, place._id)}>
                          {place._id}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                        </span>
                      );
                    }
                  })}
                  {post.post_recipients &&
                  post.post_recipients.map((email: string, index: number) => {
                    return (
                      <span key={email + 'em' + index}>
                        {email}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      </span>
                    );
                  })}
                  {post.post_places.length > 2 && <span>+{post.post_places.length - 2}</span>}
                </div>

                {!postView && post.counters.comments > 1 && (
                  <div className={style.postFooter}>
                    <IcoN size={16} name={'comments16'}/>
                    {post.counters.comments <= 1 && <p>{post.counters.comments} comment</p>}
                    {post.counters.comments > 1 && <p>{post.counters.comments} comments</p>}
                  </div>
                )}
              </div>
              {/* renders the comments and comment input in post view */}
              {!this.props.post && (
                <CommentsBoard no_comment={this.state.post.no_comment} newComment={this.newCommentReceived}
                               count={post.counters.comments} post={this.state.post} user={this.props.user}/>
              )}
              {postView && <div className={privateStyle.bottomSpace}/>}
            </div>
          </div>
        </Scrollable>
        {this.state.showAddLabel && (
          <AddLabel labels={post.post_labels} onDone={this.doneAddLabel} onClose={this.toggleAddLAbel}/>
        )}
        {this.state.showAttachPlace && (
          <AttachPlace places={post.post_places} onDone={this.doneAttachPlace} onClose={this.toggleAttachPlace}/>
        )}
        {this.state.showMovePlace && (
          <MovePlace places={post.post_places} onDone={this.doneMovePlace} onClose={this.toggleMovePlace}/>
        )}
        {this.state.showRemovePlace && (
          <RemovePlace places={post.post_places} onDone={this.doneRemovePlace} onClose={this.toggleRemovePlace}/>
        )}
        {this.state.showSeenBy && (
          <SeenBy postId={post._id} onClose={this.toggleSeenBy}/>
        )}
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
  post: ownProps.post,
  currentPost: store.app.currentPost,
  posts: store.posts,
  user: store.app.user,
  routeParams: ownProps.routeParams,
});

/**
 * @desc Provides the actions that updates store through the component props
 * @const mapDispatchToProps
 * @param {any} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  postAdd: (post: IPost) => (dispatch(postAdd(post))),
  postUpdate: (post: IPost) => (dispatch(postUpdate(post))),
  setCurrentPost: (post: IPost) => (dispatch(setCurrentPost(post))),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
