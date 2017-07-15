import * as React from 'react';
import {Input, Button, Modal, Switch} from 'antd';
import { Suggestion, IcoN } from 'components';
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
const confirm = Modal.confirm;
const style = require('./compose.css');
const styleNavbar = require('../../../components/navbar/navbar.css');

interface IParams {
  replyId?: string;
  forwardId?: string;
  placeId?: string;
}

interface IComposeProps {
  attachModal?: boolean;
  params: IParams;
  draft: IComposeState;
  setDraft: (model: IComposeState) => void;
  unsetDraft: () => void;
}

class Compose extends React.Component<IComposeProps, IComposeState> {
  private attachments: AttachmentList;
  private targets: Suggestion;
  private postApi: PostApi;
  constructor(props: any) {
    super(props);

    const defaultState: IComposeState = {
      attachments: [],
      targets: [],
      allowComment: true,
      sending: false,
      body: '',
      subject: '',
      composeOption: false,
    };
    this.state = this.props.draft || defaultState;
  }

  public componentWillMount() {
    this.setState({
      attachModal: false,
      unselectSelectedRecipient: 0,
    });
    this.postApi = new PostApi();
  }
  private attachTypeSelect = () => {
    console.log('click');
    this.setState({
      attachModal: !this.state.attachModal,
      unselectSelectedRecipient: this.state.unselectSelectedRecipient + 1,
    });
  }
  private subjectFocus = () => {
    console.log('subjectFocus');
    this.setState({
      unselectSelectedRecipient: this.state.unselectSelectedRecipient + 1,
    });
  }
  private bodyFocus = () => {
    console.log('bodyFocus');
    this.setState({
      unselectSelectedRecipient: this.state.unselectSelectedRecipient + 1,
    });
  }
  private overlayClick = (event) => {
    event.stopPropagation();
  }

  /**
   * set body in state
   *
   * @private
   * @memberof Compose
   */
  private handleBodyChange = (e: any) => {
    this.setState({
      body: e.target.value,
    });
  }

  /**
   * set subject in state
   *
   * @private
   * @memberof Compose
   */
  private handleSubjectChange = (e: any) => {
    this.setState({
      subject: e.target.value,
    });
  }

  /**
   * keep reference of AttachmentList component
   *
   * @private
   * @memberof Compose
   */
  private referenceAttachments = (value: AttachmentList) => {
    this.attachments = value;
  }

  private composeOption = () => {
    console.log('compose options');
    this.setState({
      composeOption: !this.state.composeOption,
    });
  }

  /**
   * keep reference of Suggestion component
   *
   * @private
   * @memberof Compose
   */
  private referenceTargets = (value: Suggestion) => {
    this.targets = value;
  }

  private allowComment = () => {
    this.setState({
      allowComment: !this.state.allowComment,
    });
  }

  /**
   * Validate and send the post
   *
   * @private
   * @memberof Compose
   */
  private send = () => {
    if (this.state.targets.length === 0) {
      console.log('====================================');
      console.log('No target');
      console.log('====================================');

      return;
    }

    if (!(this.state.subject || this.state.body)) {
      console.log('====================================');
      console.log('Subject or body is required');
      console.log('====================================');

      return;
    }

    if (this.attachments.isUploading()) {
      console.log('====================================');
      console.log('Upload is in progress');
      console.log('====================================');

      return;
    }

    this.setState({
      sending: true,
    });

    const params: ISendRequest = {
      forward_from: this.props.params.forwardId,
      reply_to: this.props.params.replyId,
      body: this.state.body,
      no_comment: !this.state.allowComment,
      subject: this.state.subject,
      attaches: this.state.attachments.map((i) => i.universal_id).join(','),
      targets: this.state.targets.map((i) => i._id).join(','),
    };

    this.postApi.send(params).then((response: ISendResponse) => {
      if (response.no_permit_places.length === 0) {
        console.log(`Your post has been shared.`);
      } else if (response.no_permit_places.length < this.state.targets.length) {
        console.log(`Your post has been shared, but some targets did not received that.`);
      } else {
        console.log(`None of the selected targets receive the post!`);
      }

      this.setState({
        sending: false,
      });

      browserHistory.goBack();
    }).catch(() => {
      console.log('====================================');
      console.log('An error has been occured in sharing the post!');
      console.log('====================================');
    });
  }

  private draft = () => {
    this.props.setDraft(this.state);
    browserHistory.goBack();
  }

  private discard = () => {
    this.props.unsetDraft();
    browserHistory.goBack();
  }

  private leave = () => {
    if (this.state.targets.length > 0
      || this.state.attachments.length > 0
      || this.state.body.length > 0
      || this.state.subject.length > 0) {

      confirm({
        title: 'What do you want to do?',
        okText: 'Draft',
        cancelText: 'Discard',
        onCancel: this.discard,
        onOk: this.draft,
      });
    } else {
      browserHistory.goBack();
    }
  }

  private handleAttachmentsChange = (items: IAttachment[]) => {
    this.setState({
      attachments: items,
    });
  }

  private handleTargetsChanged = (items: IChipsItem[]) => {
    this.setState({
      targets: items,
    });
  }

  public render() {
    return (
      <div className={style.compose}>
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
        {this.state.composeOption && (
          <div className={[style.composeOption, style.opened].join(' ')}>
            <ul>
              <li>
                <label htmlFor="">
                  Allow Comments
                </label>
                <Switch defaultChecked={this.state.allowComment} onChange={this.allowComment} />
              </li>
            </ul>
          </div>
        )}
        {this.state.composeOption &&
          <div onClick={this.composeOption.bind(this, '')} className={style.overlay}/>
        }
        <Suggestion ref={this.referenceTargets}
                    selectedItems={this.state.targets}
                    onSelectedItemsChanged={this.handleTargetsChanged}
        />
        <div className={style.subject}>
          <Input
                onFocus={this.subjectFocus}
                placeholder="Add a Title…"
                onChange={this.handleSubjectChange}
                value={this.state.subject}
          />
          <div onClick={this.attachTypeSelect}
          className={[style.attachmentBtn, this.state.attachModal ? style.attachActive : null].join(' ')}>
            <div onClick={this.attachTypeSelect}>
              <IcoN size={24} name={'attach24'}/>
            </div>
            {this.state.attachModal &&
              <div onClick={this.overlayClick} className={style.overlay}/>
            }
            <div className={style.attachActions} onClick={this.overlayClick}>
              <div>
                <IcoN size={24} name={'camera24'}/>
              </div>
              <div>
                <IcoN size={24} name={'attach24'}/>
              </div>
              <div onClick={this.attachTypeSelect}>
                <IcoN size={24} name={'xcross24'}/>
              </div>
            </div>
          </div>
        </div>
        <textarea
                  onFocus={this.bodyFocus}
                  placeholder="Write something…"
                  onChange={this.handleBodyChange}
                  value={this.state.body}
        />
        <AttachmentList
                        ref={this.referenceAttachments}
                        items={this.state.attachments}
                        onItemsChanged={this.handleAttachmentsChange}
        />
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
