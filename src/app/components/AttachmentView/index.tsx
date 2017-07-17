import * as React from 'react';
import * as Hammer from 'react-hammerjs';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageThumbnail from './components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import {IcoN} from 'components';
const style = require('./attachmentview.css');

interface IProps {
  attachments: IPostAttachment[];
  selectedAttachment?: IPostAttachment | null;
  onClose: () => void;
}

interface IState {
  selectedAttachment: IPostAttachment;
  attachments: IPostAttachment[];
}

export default class AttachmentView extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedAttachment: this.props.selectedAttachment,
      attachments: this.props.attachments,
    };
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      attachments: newProps.attachments,
    });
  }

  private next() {
    const indexOfAttachment = this.state.attachments.findIndex((attachment: IPostAttachment) => {
      return attachment._id === this.state.selectedAttachment._id;
    });

    if (this.state.attachments.length - 1 === indexOfAttachment) {
      this.setState({selectedAttachment: this.state.attachments[0]});
    } else if (this.props.attachments.length - 1 > indexOfAttachment) {
      this.setState({selectedAttachment: this.state.attachments[indexOfAttachment + 1]});
    }
  }

  private prev() {
    const indexOfAttachment = this.state.attachments.findIndex((attachment: IPostAttachment) => {
      return attachment._id === this.state.selectedAttachment._id;
    });

    if (indexOfAttachment > 0) {
      this.setState({selectedAttachment: this.state.attachments[indexOfAttachment - 1]});
    } else {
      this.setState({selectedAttachment: this.state.attachments[this.state.attachments.length - 1]});
    }
  }

  private onSwipe(event: any, props: any) {
    console.log(props, event);
    if (props.direction === 2) {
      this.next();
    } else if (props.direction === 4) {
      this.prev();
    }
  }

  public render() {
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
            1 of 5
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
              this.state.selectedAttachment.type === AttachmentType.IMAGE) && (
              <span>Original Image: {this.state.selectedAttachment.size} kb, 
              {this.state.selectedAttachment.height} × {this.state.selectedAttachment.width}</span>
            )}
          </div>
          <a onClick={this.props.onClose}>
            <IcoN size={24} name={'attach24'}/>
          </a>
        </div>
      </div>
    );
  }
}
