import * as React from 'react';
import {Input, Icon, Button, Popconfirm} from 'antd';
import { Suggestion } from 'components';
import AttachmentList from './AttachmentList';
const style = require('./compose.css');
import ISendRequest from 'api/post/interfaces/ISendRequest';
import ISendResponse from 'api/post/interfaces/ISendResponse';
import PostApi from 'api/post';
import {browserHistory} from 'react-router';
import IComposeState from 'api/post/interfaces/IComposeState';
import {setDraft, unsetDraft} from 'redux/app/actions';
import {connect} from 'react-redux';
import {IAttachment} from 'api/attachment/interfaces';

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
      loading: false,
    };
    console.log('====================================');
    console.log(this.props.draft);
    console.log('====================================');
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

  /**
   * keep reference of Suggestion component
   *
   * @private
   * @memberof Compose
   */
  private referenceTargets = (value: Suggestion) => {
    this.targets = value;
  }

  /**
   * Validate and send the post
   *
   * @private
   * @memberof Compose
   */
  private send = () => {
    if (this.targets.get().length === 0) {
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
      loading: true,
    });

    const targets = this.targets.get();

    const params: ISendRequest = {
      forward_from: this.props.params.forwardId,
      reply_to: this.props.params.replyId,
      body: this.state.body,
      no_comment: !this.state.allowComment,
      subject: this.state.subject,
      attaches: this.state.attachments.map((i) => i.universal_id).join(','),
      targets: targets.map((i) => i._id).join(','),
    };

    this.postApi.send(params).then((response: ISendResponse) => {
      if (response.no_permit_places.length === 0) {
        console.log(`Your post has been shared.`);
      } else if (response.no_permit_places.length < targets.length) {
        console.log(`Your post has been shared, but some targets did not received that.`);
      } else {
        console.log(`None of the selected targets receive the post!`);
      }

      this.setState({
        loading: false,
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
  }

  private handleAttachmentsChange = (items: IAttachment[]) => {
    this.setState({
      attachments: items,
    });
  }

  public render() {
    return (
      <div className={style.compose}>
        <Suggestion ref={this.referenceTargets}
                    selectedItems={[]}
                    unselectSelectedRecipient={this.state.unselectSelectedRecipient}
        />
        <div className={style.subject}>
          <Input
                onFocus={this.subjectFocus}
                placeholder="Add a Title…"
                onChange={this.handleSubjectChange}
                value={this.state.subject}
          />
          <div onClick={this.attachTypeSelect}
          className={this.state.attachModal ? style.attachmentBtn + ' ' + style.attachActive : style.attachmentBtn}>
            <Icon type="link" />
            <div onClick={this.overlayClick} className={style.overlay}/>
            <div className={style.attachActions} onClick={this.overlayClick}>
              <Icon type="rocket" /><Icon type="car" /><Icon type="close"  onClick={this.attachTypeSelect}/>
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
        <Button type="primary" onClick={this.send}>Send</Button>
        <Popconfirm
                    placement="rightTop"
                    title="What do you want to do?"
                    onConfirm={this.draft}
                    onCancel={this.discard}
                    okText="Draft"
                    cancelText="Discard"
        >
          <Button style={{width: 128}}>Leave</Button>
        </Popconfirm>
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
