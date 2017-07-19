import * as React from 'react';
import * as Hammer from 'react-hammerjs';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageThumbnail from './components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import {IcoN} from 'components';
import AttachmentApi from 'api/attachment';
import FileUtil from 'services/utils/file';
import {message} from 'antd';

const style = require('./attachmentview.css');

interface IProps {
  attachments: IPostAttachment[];
  selectedAttachment?: IPostAttachment | null;
  onClose: () => void;
}

interface IState {
  selectedAttachment: IPostAttachment;
  attachments: IPostAttachment[];
  downloadUrl: string;
}

export default class AttachmentView extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedAttachment: this.props.selectedAttachment,
      attachments: this.props.attachments,
      downloadUrl: '',
    };

    this.setDownloadUrl = this.setDownloadUrl.bind(this);
  }

  public componentDidMount() {
    console.log('====================================');
    console.log(this.state.selectedAttachment);
    console.log('====================================');
    this.setDownloadUrl(this.state.selectedAttachment._id);
  }

  public setDownloadUrl(id: string): void {
      AttachmentApi.getDownloadToken({
        universal_id: id,
      }).then((token: string) => {
        this.setState({
          downloadUrl: FileUtil.getDownloadUrl(id, token),
        });
      }, () => {
        this.setState({
          downloadUrl: null,
        });
      });
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      attachments: newProps.attachments,
    });
  }

  private getIndexOfAttachment() {
    const indexOfAttachment = this.state.attachments.findIndex((attachment: IPostAttachment) => {
      return attachment._id === this.state.selectedAttachment._id;
    });
    return indexOfAttachment;
  }

  private next() {
    const indexOfAttachment = this.getIndexOfAttachment();
    let next: IPostAttachment = null;
    if (this.state.attachments.length - 1 === indexOfAttachment) {
      next =  this.state.attachments[0];
    } else if (this.props.attachments.length - 1 > indexOfAttachment) {
      next = this.state.attachments[indexOfAttachment + 1];
    }

    this.setState({selectedAttachment: next});
    this.setDownloadUrl(next._id);
  }

  private prev() {
    const indexOfAttachment = this.getIndexOfAttachment();
    let next: IPostAttachment = null;

    if (indexOfAttachment > 0) {
      next = this.state.attachments[indexOfAttachment - 1];
    } else {
      next = this.state.attachments[this.state.attachments.length - 1];
    }

    this.setState({selectedAttachment: next});
    this.setDownloadUrl(next._id);
  }

  private onSwipe(event: any, props: any) {
    console.log(props, event);
    if (props.direction === 2) {
      this.next();
    } else if (props.direction === 4) {
      this.prev();
    }
  }

  private download(e: any) {
    if (!this.state.downloadUrl) {
      message.error('We are not able to serve the file, try again later.');

      e.preventDefault();
    }
  }

  public render() {
    const indexOfAttachment = this.getIndexOfAttachment();

    return (
      <div
        id={'attachment-view'}
        className={style.attachmentView}
      >
        <div className={style.navigation}>
          <a onClick={this.props.onClose}>
            <IcoN size={24} name={'xcross24White'}/>
          </a>
          <span>
            {indexOfAttachment + 1} of {this.state.attachments.length}
          </span>
          {/*<button onClick={this.next.bind(this, '')}>next</button>
          <button onClick={this.prev.bind(this, '')}>prev</button>*/}
        </div>
        <Hammer onSwipe={this.onSwipe.bind(this, '')} direction="DIRECTION_ALL"
        >
          <div>
            {(this.state.selectedAttachment.type === AttachmentType.GIF ||
              this.state.selectedAttachment.type === AttachmentType.IMAGE) &&
            <ImageThumbnail attachment={this.state.selectedAttachment}/>
            }
            {this.state.selectedAttachment.type === AttachmentType.VIDEO &&
            <VideoThumbnail attachment={this.state.selectedAttachment}/>
            }
            {this.state.selectedAttachment.type !== AttachmentType.GIF &&
            this.state.selectedAttachment.type !== AttachmentType.IMAGE &&
            this.state.selectedAttachment.type !== AttachmentType.VIDEO &&
            <OtherThumbnail attachment={this.state.selectedAttachment}/>
            }
          </div>
        </Hammer>
        <div className={style.footer}>
          <div>
            <p>{this.state.selectedAttachment.filename}</p>
            {(this.state.selectedAttachment.type === AttachmentType.GIF ||
              this.state.selectedAttachment.type === AttachmentType.IMAGE) ? (
              <span>Original Image:
                {/*{this.state.selectedAttachment.size} kb,*/}
                {this.state.selectedAttachment.height} × {this.state.selectedAttachment.width}</span>
            ) : (
              <span>
                {/*{this.state.selectedAttachment.size} kb*/}
              </span>
            )}
          </div>
          <a onClick={this.download} href={this.state.downloadUrl}>
            <IcoN size={24} name={'attach24'}/>
          </a>
        </div>
      </div>
    );
  }
}
