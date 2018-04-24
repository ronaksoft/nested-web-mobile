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
  LabelChips, Scrollable,
} from 'components';
import {IPlace, ILabel, IUser} from 'api/interfaces/';
import TimeUntiles from '../../../../../services/utils/time';
import PostApi from '../../../../../api/post/index';
import {connect} from 'react-redux';
import {setCurrentPost, setPosts} from '../../../../../redux/app/actions/index';
import CommentsBoard from '../comment/index';
import PostAttachment from '../../../../../components/PostAttachment/index';
import {hashHistory, Link} from 'react-router';
import IAddLabelRequest from '../../../../../api/post/interfaces/IAddLabelRequest';
import IRemoveLabelRequest from '../../../../../api/post/interfaces/IRemoveLabelRequest';
import {difference} from 'lodash';

const style = require('./post.css');
const styleNavbar = require('../../../../../components/navbar/navbar.css');
const privateStyle = require('../../../private.css');
import CONFIG from '../../../../../config';

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
  setPosts: (posts: IPost[]) => {};
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
}

/**
 * @class Post
 * @extends {React.Component<IProps, IState>}
 * @desc A post-card component
 */
class Post extends React.Component<IProps, IState> {
  private PostApi: PostApi;
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
    if (this.props.post) {
      let body = this.props.post.body || this.props.post.preview;
      body = body.replace(/<div>/g, '');
      this.subjectRtl = RTLDetector.getInstance().direction(this.props.post.subject);
      this.bodyRtl = RTLDetector.getInstance().direction(body);
      this.setState({
        post: this.props.post ? this.props.post : null,
      });
    } else {
      this.PostApi.getPost(this.props.routeParams.postId ? this.props.routeParams.postId : this.props.post._id, true)
        .then((post: IPost) => {
          post.post_read = true;
          this.subjectRtl = RTLDetector.getInstance().direction(post.subject);
          this.bodyRtl = RTLDetector.getInstance().direction(post.body.replace(/<div>/g, ''));
          this.setState({
            post,
          });
          this.updatePostsInStore('post_read', true);
          // setTimeout( () => {
          //   this.loadBodyEv(this.htmlBodyRef);
          // }, 300);
        });

      // scroll top to clear previous page scroll
      window.scrollTo(0, 0);
    }

    // setTimeout(() => {
    //   this.loadBodyEv(this.htmlBodyRef);
    // }, 300);

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

  /**
   * @function componentWillUnmount
   * remove event listeners on this situation
   * @override
   * @memberOf Post
   */
  public componentWillUnmount() {
    window.removeEventListener('message', this.onIframeMessageHandler);
  }

  /**
   * @func componentWillReceiveProps
   * @desc Replaces the post in the component state with the new post in received props
   * @param {IProps} newProps
   * @memberof Post
   * @override
   */
  public componentWillReceiveProps(newProps: IProps) {
    if (this.props.post) {
      this.setState({
        post: newProps.post ? newProps.post : null,
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

    const posts = JSON.parse(JSON.stringify(this.props.posts));
    let newPosts;
    if (!Array.isArray(posts)) {
      return;
    }
    newPosts = posts.map((post: IPost) => {
      if (post._id === this.state.post._id) {
        post[key] = value;
      }
      return post;
    });

    this.props.setPosts(newPosts);

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
    let post;
    post = JSON.parse(JSON.stringify(this.state.post));
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
          let post;
          this.inProgress = false;
          post = this.state.post;
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

  public componentDidUpdate() {
    // setTimeout(() => {
    // }, 1000);
    if (this.htmlBodyRef && !this.resizedPostBody) {
      this.resizedPostBody = true;
      const images = this.htmlBodyRef.querySelectorAll('img');
      let imagesLoaded = 0;
      let imagesNotLoaded = 0;
      this.htmlBodyRef.querySelectorAll('img').forEach((image, index) => {
        if (image.complete) {
          imagesLoaded++;
        } else {
          image.onload = () => {
            imagesLoaded++;
            // console.log(image, imagesLoaded, imagesLoaded === images.length - 1);
            if (imagesLoaded + imagesNotLoaded === images.length - 1) {
              this.loadBodyEv(this.htmlBodyRef);
            }
          };
          image.onerror = () => {
            imagesNotLoaded++;
            // console.log(image, imagesLoaded, imagesLoaded === images.length - 1);
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
      if (obj.contentWindow) {
        this.iframeObj = obj;
        window.addEventListener('message', this.onIframeMessageHandler);
      }
    }, 100);
  }

  private onIframeMessageHandler = (e) => {
    try {
      if (this.state.post.iframe_url.indexOf(e.origin) === -1) {
        return;
      }
      const data = JSON.parse(e.data);
      if (data.url === this.state.post.iframe_url) {
        switch (data.cmd) {
          case 'getInfo':
            const userData = this.getUserData();
            this.iframeObj.contentWindow.postMessage(this.sendIframeMessage('setInfo', userData), '*');
            break;
          case 'setSize':
            this.iframeObj.style.cssText = 'height: ' + data.data.height + 'px !important';
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
    const userId = this.props.user._id;
    const msgId = this.state.post._id;
    const app = CONFIG().DOMAIN;
    return {
      userId,
      msgId,
      app,
      locale: 'en-US',
      dark: false,
    };
  }

  private sendIframeMessage(cmd, data) {
    const msg: any = {
      cmd,
      data,
    };
    return JSON.stringify(msg);
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

    const getIframeUrl = (url: any) => {
      const userId = this.props.user._id;
      const msgId = this.state.post ? this.state.post._id : '';
      const app = CONFIG().DOMAIN;
      let urlPostFix = '';
      if (url.indexOf('#') > -1) {
        url = url.split('#');
        urlPostFix = '#' + url[1];
        url = url[0];
      }
      if (url.indexOf('?') > -1) {
        url += '&';
      } else {
        url += '?';
      }
      url += 'nst_user=' + userId + '&nst_mid=' + msgId + '&nst_app=' + app + '&nst_locale=en-US';
      return url + urlPostFix;
    };

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
                  <iframe width="100%" src={getIframeUrl(post.iframe_url)} scrolling="auto"
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
                <CommentsBoard no_comment={this.state.post.no_comment}
                               post_id={this.state.post._id} post={this.state.post}
                               user={this.props.user} newComment={this.newCommentReceived}/>
              )}
              {postView && <div className={privateStyle.bottomSpace}/>}
            </div>
          </div>
        </Scrollable>
        {this.state.showAddLabel && (
          <AddLabel labels={post.post_labels} onDone={this.doneAddLabel} onClose={this.toggleAddLAbel}/>
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
  posts: store.app.posts,
  user: store.app.user,
  routeParams: ownProps.routeParams,
});

/**
 * @desc Provides the actions that updates store through the component props
 * @const mapDispatchToProps
 * @param {any} dispatch
 */
const mapDispatchToProps = (dispatch) => ({
  setPosts: (posts: IPost[]) => (dispatch(setPosts(posts))),
  setCurrentPost: (post: IPost) => (dispatch(setCurrentPost(post))),
});

export default connect(mapStateToProps, mapDispatchToProps)(Post);
