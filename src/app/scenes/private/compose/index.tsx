import * as React from 'react';
import {Input, Icon, Button} from 'antd';
import { Suggestion } from 'components';
import AttachmentList from './AttachmentList';
const style = require('./compose.css');
import ISendRequest from 'api/post/interfaces/ISendRequest';
import ISendResponse from 'api/post/interfaces/ISendResponse';
import PostApi from 'api/post';

interface IParams {
  replyId?: string;
  forwardId?: string;
  placeId?: string;
}

interface IComposeProps {
  attachModal?: boolean;
  params: IParams;
}

interface IComposeState {
  subject?: string;
  body?: string;
  attachments: string[];
  targets: string[];
  allowComment: boolean;
  loading: boolean;
  attachModal?: boolean;
  unselectSelectedRecipient?: number;
}
class Compose extends React.Component<IComposeProps, IComposeState> {
  private attachments: AttachmentList;
  private targets: Suggestion;
  private postApi: PostApi;
  constructor(props: any) {
    super(props);
    this.state = {
      attachments: [],
      targets: [],
      allowComment: true,
      loading: false,
    };
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

  private handleBodyChange = (e: any) => {
    this.setState({
      body: e.target.value,
    });
  }

  private handleSubjectChange = (e: any) => {
    this.setState({
      subject: e.target.value,
    });
  }

  private referenceAttachments = (value: AttachmentList) => {
    this.attachments = value;
  }

  private referenceTargets = (value: Suggestion) => {
    this.targets = value;
  }

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

    const params: ISendRequest = {
      forward_from: this.props.params.forwardId,
      reply_to: this.props.params.replyId,
      body: this.state.body,
      no_comment: !this.state.allowComment,
      subject: this.state.subject,
      attaches: this.attachments.get().map((i) => i.model.universal_id).join(','),
      targets: this.targets.get().map((i) => i._id).join(','),
    };

    this.postApi.send(params).then((response: ISendResponse) => {
      console.log('====================================');
      console.log(response);
      console.log('====================================');
    }).catch((error) => {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
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
          <Input onFocus={this.subjectFocus} placeholder="Add a Title…" onChange={this.handleSubjectChange}/>
          <div onClick={this.attachTypeSelect}
          className={this.state.attachModal ? style.attachmentBtn + ' ' + style.attachActive : style.attachmentBtn}>
            <Icon type="link" />
            <div onClick={this.overlayClick} className={style.overlay}/>
            <div className={style.attachActions} onClick={this.overlayClick}>
              <Icon type="rocket" /><Icon type="car" /><Icon type="close"  onClick={this.attachTypeSelect}/>
            </div>
          </div>
        </div>
        <textarea onFocus={this.bodyFocus} placeholder="Write something…" onChange={this.handleBodyChange} />
        <AttachmentList ref={this.referenceAttachments}/>
        <Button type="primary" onClick={this.send}>Send</Button>
      </div>
    );
  }
}

export { Compose }
