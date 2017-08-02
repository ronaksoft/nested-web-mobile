/**
 * @file scenes/private/compose/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.me>
 * @description This component is designed to give you the ability to share posts.
 * This component contains an intelligent suggest that helps to find targets and a file
 * uploader that lets you upload multiple files at the same time.
 * Documented by:          Soroush Torkzadeh <sorousht@nested.me>
 * Date of documentation:  2017-07-24
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import {Input, Button, Modal, Switch, message} from 'antd';
import {Suggestion, IcoN} from 'components';
import AttachmentList from './AttachmentList';
import ISendRequest from 'api/post/interfaces/ISendRequest';
import ISendResponse from 'api/post/interfaces/ISendResponse';
import PostApi from 'api/post';
import {browserHistory} from 'react-router';
import IComposeState from 'api/post/interfaces/IComposeState';
import {setDraft, unsetDraft} from 'redux/app/actions';
import {connect} from 'react-redux';
import {IAttachment} from 'api/attachment/interfaces';
import {IChipsItem} from 'components/Chips';
import IPost from 'api/post/interfaces/IPost';
import IPostAttachment from 'api/post/interfaces//IPostAttachment';

const confirm = Modal.confirm;
const style = require('./compose.css');
const styleNavbar = require('../../../components/navbar/navbar.css');

/**
 * @interface IParams
 * @desc Interface of parameters that React-Router provides through props
 */
interface IParams {
  /**
   * @property replyId
   * @desc A post Id that the message is going to be a reply to it
   * @type {string}
   * @memberof IParams
   */
  replyId?: string;
  /**
   * @property forwardId
   * @desc A post Id that the message is going to forward from
   * @type {string}
   * @memberof IParams
   */
  forwardId?: string;
  /**
   * @prop placeId
   * @desc The message should be shared with a place with the given Id
   * @type {string}
   * @memberof IParams
   */
  placeId?: string;
}

/**
 * @interface IComposeProps
 * @desc Interface of the component properties
 */
interface IComposeProps {
  attachModal?: boolean;
  /**
   * @prop params
   * @desc The parameters that React Router provides
   * @type {IParams}
   * @memberof IComposeProps
   */
  params: IParams;
  /**
   * @prop draft
   * @desc The post draft the redux provides through the component properties
   * @type {IComposeState}
   * @memberof IComposeProps
   */
  draft: IComposeState;
  /**
   * @prop setDraft
   * @desc Stores a copy of message based on IComposeState interface
   * @memberof IComposeProps
   */
  setDraft: (model: IComposeState) => void;
  /**
   * @prop unsetDraft
   * @desc Clears the stored draft in redux
   * @memberof IComposeProps
   */
  unsetDraft: () => void;
}

/**
 * (description is missed)
 */
class Compose extends React.Component<IComposeProps, IComposeState> {
  private isHtml: boolean = false;
  private htmlBodyRef: HTMLDivElement;

  /**
   * @prop attachments
   * @desc Reference of `AttachmentList` component
   * @private
   * @type {AttachmentList}
   * @memberof Compose
   */
  private attachments: AttachmentList;

  /**
   * @prop targets
   * @desc Reference of `Suggestion` component
   * @private
   * @type {Suggestion}
   * @memberof Compose
   */
  private targets: Suggestion;

  /**
   * @prop postApi
   * @desc An instance of PostApi
   * @private
   * @type {PostApi}
   * @memberof Compose
   */
  private postApi: PostApi;

  /**
   * @prop file
   * @desc Html input of file type
   * @private
   * @type {HTMLInputElement}
   * @memberof Compose
   */
  private file: HTMLInputElement;

  /**
   * @prop mediaMode
   * @desc The user can upload an attachment as a file or media. We use this flag
   * to identify which upload button has been clicked.
   * @private
   * @type {boolean}
   * @memberof Compose
   */
  private mediaMode: boolean;

  /**
   * Creates an instance of Compose.
   * @constructor
   * @param {IComposeProps} props
   * @memberof Compose
   */
  constructor(props: IComposeProps) {
    super(props);

    // An empty compose page state
    const defaultState: IComposeState = {
      attachments: [],
      targets: [],
      contentType: 'text/plain',
      allowComment: true,
      sending: false,
      body: '',
      subject: '',
      composeOption: false,
      attachModal: false,
    };

    // A post draft is a copy of the component state in redux.
    this.state = props.draft || defaultState;
  }

  /**
   * @func componentDidMount
   * @desc Loads the post with a given Id in the route parametetrs.
   * The new post can be a reply to or forwared from the target post.
   * @memberof Compose
   */
  public componentDidMount() {
    this.postApi = new PostApi();
    if (this.props.params.replyId || this.props.params.forwardId) {
      this.postApi.get({
        post_id: this.props.params.replyId || this.props.params.forwardId,
      }).then((post: IPost) => {
        console.log(post);
        // Setting to reply the message by loading the recipients and subject of the target post.
        if (this.props.params.replyId) {

          const targets = post.post_places.map((i) => {
            const chipsItem: IChipsItem = {
              _id: i._id,
              name: i.name,
              picture: i.picture,
            };

            return chipsItem;
          }).concat(post.post_recipients.map((i) => {
            const chipsItem: IChipsItem = {
              _id: i._id,
              name: i.name,
              picture: i.picture,
            };

            return chipsItem;
          }));

          this.setState({
            targets,
            subject: post.subject,
          });

          this.targets.load(targets);

        } else {
          // Setting to forward the message by loading the post subject, body and attachments
          const attachments = post.post_attachments.map((i: IPostAttachment) => {
            const attachment: IAttachment = {
              universal_id: i._id,
              name: i.filename,
              expiration_timestamp: 0,
              size: i.size,
              thumbs: i.thumbs,
              type: i.type,
            };

            return attachment;
          });
          this.isHtml = post.content_type === 'text/html';
          console.log(this.isHtml);
          this.setState({
            subject: post.subject,
            body: post.body,
            contentType: post.content_type,
            attachments,
          });

          this.attachments.load(attachments);
        }
      }, () => {
        message.error('An error has occured in loading the post!');
      });
    }
  }

  /**
   * toogle view toolbar of attachments
   * @func attachTypeSelect
   * @private
   * @memberOf Compose
   */
  private attachTypeSelect = () => {
    this.setState({
      attachModal: !this.state.attachModal,
    });
    this.targets.clearSuggests();
  }

  /**
   * register a handler for subject input focus
   * @private
   * @func subjectFocus
   * @memberOf Compose
   */
  private subjectFocus = () => {
    this.targets.clearSuggests();
  }

  /**
   * register a handler for body input focus
   * @private
   * @func bodyFocus
   * @memberOf Compose
   */
  private bodyFocus = () => {
    this.targets.clearSuggests();
  }

  /**
   * register a handler for click on black overlay
   * @private
   * @func overlayClick
   * @memberOf Compose
   */
  private overlayClick = (event) => {
    event.stopPropagation();
  }

  /**
   * @param handleBodyChange
   * @desc Updates body in the component state
   * @private
   * @memberof Compose
   * @param {*} e
   */
  private handleBodyChange = (e: any) => {
    this.setState({
      body: e.target.value,
    });
  }

  /**
   * @function handleSubjectChange
   * @desc Updates subject in the component state
   * @private
   * @memberof Compose
   * @param {*} e
   */
  private handleSubjectChange = (e: any) => {
    this.setState({
      subject: e.target.value,
    });
  }

  /**
   * @func referenceAttachments
   * @desc Keeps reference of AttachmentList component
   * @private
   * @memberof Compose
   * @param {AttachmentList} value
   */
  private referenceAttachments = (value: AttachmentList) => {
    this.attachments = value;
  }

  /**
   * @func composeOption
   * @desc toggle the compose option popover
   * @private
   * @memberof Compose
   * @param {AttachmentList} value
   */
  private composeOption = () => {
    this.setState({
      composeOption: !this.state.composeOption,
    });
  }

  /**
   * @func referenceTargets
   * @desc Keeps reference of Suggestion component
   * @private
   * @memberof Compose
   * @param {Suggestion} value
   */
  private referenceTargets = (value: Suggestion) => {
    this.targets = value;
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
   * @func allowComment
   * @desc Toggles allow comment on/off in the component state
   * @private
   * @memberof Compose
   */
  private allowComment = () => {
    this.setState({
      allowComment: !this.state.allowComment,
    });
  }

  /**
   * @func send
   * @desc Validates and sends the post
   * @private
   * @memberof Compose
   */
  private send = () => {
    // Validation
    if (this.state.targets.length === 0) {
      message.error('No target is specified');

      return;
    }

    if (!(this.state.subject ||
        this.state.body ||
        this.state.attachments.length > 0)) {
      message.error('You can not send an empty message');

      return;
    }

    if (this.attachments.isUploading()) {
      message.error('Upload is in progress');

      return;
    }

    // Sending the post

    this.setState({
      sending: true,
    });

    const params: ISendRequest = {
      forward_from: this.props.params.forwardId,
      reply_to: this.props.params.replyId,
      body: this.isHtml ? this.htmlBodyRef.innerHTML : this.state.body,
      no_comment: !this.state.allowComment,
      content_type: this.isHtml ? 'text/html' : 'text/plain',
      subject: this.state.subject,
      attaches: this.state.attachments.map((i) => i.universal_id).join(','),
      targets: this.state.targets.map((i) => i._id).join(','),
    };

    this.postApi.send(params).then((response: ISendResponse) => {
      if (response.no_permit_places.length === 0) {
        message.success(`Your post has been shared.`);
      } else if (response.no_permit_places.length < this.state.targets.length) {
        message.warning(`Your post has been shared, but some targets did not received that.`);
      } else {
        message.error(`None of the selected targets receive the post!`);
      }

      this.setState({
        sending: false,
      });

      browserHistory.goBack();
    }).catch(() => {
      message.error('An error has been occured in sharing the post!');
    });
  }

  /**
   * @func draft
   * @desc Save the current state of the component
   * @private
   * @memberof Compose
   */
  private draft = () => {
    this.props.setDraft(this.state);
    browserHistory.goBack();
  }

  /**
   * @func discard
   * @desc Removes the stored copy of state
   * @private
   * @memberof Compose
   */
  private discard = () => {
    this.props.unsetDraft();
    browserHistory.goBack();
  }

  /**
   * @func leave
   * @desc Redirects to the previous route, but warns the user if there are uploading file or
   * asks him/her to keep a draft before leaving the page.
   * @private
   * @memberof Compose
   */
  private leave = () => {
    if (this.attachments.isUploading()) {
      confirm({
        title: 'Upload in progress',
        content: 'An upload is in progress. Do you want to abort the process and leave here?',
        cancelText: 'Yes, Let me go',
        okText: 'No',
        onCancel: () => {
          this.attachments.abortAll();
          browserHistory.goBack();
        },
      });

      return;
    }

    if (this.state.targets.length > 0
      || this.state.attachments.length > 0
      || this.state.body.length > 0
      || this.state.subject.length > 0) {

      confirm({
        title: 'Save a draft',
        content: `Do you want to save a draft before leaving here?`,
        okText: 'Yes',
        cancelText: 'No, Let me go',
        onCancel: this.discard,
        onOk: this.draft,
      });
    } else {
      browserHistory.goBack();
    }
  }

  /**
   * @func handleAttachmentsChange
   * @desc Updates the component state with a new list of attachments
   * @private
   * @memberof Compose
   * @param {IAttachment[]} items
   */
  private handleAttachmentsChange = (items: IAttachment[]) => {
    this.setState({
      attachments: items,
    });
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
    this.setState({
      targets: items,
    });
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

  private refHandler = (value) => {
    this.htmlBodyRef = value;
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof Compose
   */
  public render() {
    return (
      <div className={style.compose}>
        {/* specefic compose navbar */}
        <div className={styleNavbar.navbar}>
          <a onClick={this.leave}>
            <IcoN size={24} name="xcross24"/>
          </a>
          <div className={styleNavbar.filler}/>
          <a onClick={this.composeOption.bind(this, '')}>
            <IcoN size={16} name="gear16"/>
          </a>
          <Button type="primary" onClick={this.send} disabled={this.state.sending}>Share</Button>
        </div>
        {/* compose options popover */}
        {this.state.composeOption && (
          <div className={[style.composeOption, style.opened].join(' ')}>
            <ul>
              <li>
                <label htmlFor="">
                  Allow Comments
                </label>
                <Switch defaultChecked={this.state.allowComment} onChange={this.allowComment}/>
              </li>
            </ul>
          </div>
        )}
        {/* compose options popover overlay */}
        {this.state.composeOption &&
        <div onClick={this.composeOption.bind(this, '')} className={style.overlay}/>
        }
        {/* suggestion component for recipients */}
        <Suggestion ref={this.referenceTargets}
                    selectedItems={this.state.targets}
                    onSelectedItemsChanged={this.handleTargetsChanged}
        />
        {/* Compose subject input */}
        <div className={style.subject}>
          <Input
            onFocus={this.subjectFocus}
            placeholder="Add a Title…"
            onChange={this.handleSubjectChange}
            value={this.state.subject}
          />
          {/* attachment popover toggler */}
          <div onClick={this.attachTypeSelect}
               className={[style.attachmentBtn, this.state.attachModal ? style.attachActive : null].join(' ')}>
            <div onClick={this.attachTypeSelect}>
              <IcoN size={24} name={'attach24'}/>
            </div>
            {/* attachment popover overlay */}
            {this.state.attachModal &&
            <div onClick={this.overlayClick} className={style.overlay}/>
            }
            {/* attachment buttons */}
            <div className={style.attachActions} onClick={this.overlayClick}>
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
        </div>
        {/* compose body */}
        {!this.isHtml && (
          <textarea
            onFocus={this.bodyFocus}
            placeholder="Write something…"
            onChange={this.handleBodyChange}
            value={this.state.body}
          />
        )}
        {this.isHtml && (
          <div contentEditable={true} dangerouslySetInnerHTML={{__html: this.state.body}}
          ref={this.refHandler}/>
        )}
        {/* attachments uploading/uploaded list */}
        <AttachmentList
          onItemsChanged={this.handleAttachmentsChange}
          ref={this.referenceAttachments}
          items={this.state.attachments}
        />
        {/* hidden input for attachment upload */}
        <input ref={this.referenceFile} id="myFile" type="file" onChange={this.upload} style={{display: 'none'}}/>
      </div>
    );
  }
}

const mapStateToProps = (store) => ({
  draft: store.app.draft,
});

const mapDispatchToProps = (dispatch) => {
  return ({
    setDraft: (model: IComposeState) => {
      dispatch(setDraft(model));
    },
    unsetDraft: () => {
      dispatch(unsetDraft());
    },
  });
};

export default connect(mapStateToProps, mapDispatchToProps)(Compose);
