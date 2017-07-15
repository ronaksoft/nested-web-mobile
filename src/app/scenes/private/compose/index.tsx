import * as React from 'react';
import {Input, Button, Switch} from 'antd';
import { Suggestion, IcoN } from 'components';
import AttachmentList from './AttachmentList';
import ISendRequest from 'api/post/interfaces/ISendRequest';
import ISendResponse from 'api/post/interfaces/ISendResponse';
import PostApi from 'api/post';
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
  composeOption: boolean;
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
      composeOption: false,
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

  private closeCompose = () => {
    console.log('close compose');
  }

  private composeOption = () => {
    console.log('compose options');
    this.setState({
      composeOption: !this.state.composeOption,
    });
  }

  private referenceTargets = (value: Suggestion) => {
    this.targets = value;
  }

  private allowComment = () => {
    this.setState({
      allowComment: !this.state.allowComment,
    });
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
        <div className={styleNavbar.navbar}>
          <a onClick={this.closeCompose}>
            <IcoN size={24} name="xcross24"/>
          </a>
          <div className={styleNavbar.filler}/>
          <a onClick={this.composeOption.bind(this, '')}>
            <IcoN size={16} name="gear16"/>
          </a>
          <a>
            <Button type="primary" onClick={this.send}>Share</Button>
          </a>
        </div>
        <div className={[style.composeOption, this.state.composeOption ? style.opened : null].join(' ')}>
          <ul>
            <li>
              <label htmlFor="">
                Allow Comments
              </label>
              <Switch defaultChecked={this.state.allowComment} onChange={this.allowComment} />
            </li>
          </ul>
        </div>
        <Suggestion ref={this.referenceTargets}
                    selectedItems={[]}
                    unselectSelectedRecipient={this.state.unselectSelectedRecipient}
        />
        <div className={style.subject}>
          <Input onFocus={this.subjectFocus} placeholder="Add a Title…" onChange={this.handleSubjectChange}/>
          <div onClick={this.attachTypeSelect}
          className={[style.attachmentBtn, this.state.attachModal ? style.attachActive : null].join(' ')}>
            <div onClick={this.attachTypeSelect}>
              <IcoN size={24} name={'attach24'}/>
            </div>
            <div onClick={this.overlayClick} className={style.overlay}/>
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
        <textarea onFocus={this.bodyFocus} placeholder="Write something…" onChange={this.handleBodyChange} />
        <AttachmentList ref={this.referenceAttachments}/>
        
      </div>
    );
  }
}

export { Compose }
