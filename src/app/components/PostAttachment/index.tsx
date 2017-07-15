import * as React from 'react';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageThumbnail from 'components/PostAttachment/components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import AttachmentView from '../AttachmentView/index';

interface IProps {
  attachments: IPostAttachment[];
}

interface IState {
  selectedAttachment: IPostAttachment | null;
  showAttachmentView: boolean;
}

export default class PostAttachment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedAttachment: null,
      showAttachmentView: false,
    };
  }

  private showAttachment(attachment: IPostAttachment) {
    this.setState({
      selectedAttachment: attachment,
      showAttachmentView: true,
    });
  }

  private onHiddenAttachment() {
    this.setState({
      selectedAttachment: null,
      showAttachmentView: false,
    });
  }

  public render() {
    return (
      <div>
        <ul>
          {this.props.attachments.map((attachment: IPostAttachment) => {
            switch (attachment.type) {
              case AttachmentType.GIF:
              case AttachmentType.IMAGE:
                return <ImageThumbnail onclick={this.showAttachment.bind(this, attachment)}
                                       fullWidth={this.props.attachments.length === 1}
                                       attachment={attachment}/>;
              case AttachmentType.VIDEO:
                return <VideoThumbnail onclick={this.showAttachment.bind(this, attachment)}
                                       fullWidth={this.props.attachments.length === 1}
                                       attachment={attachment}/>;
              default:
                return <OtherThumbnail onclick={this.showAttachment.bind(this, attachment)}
                                       attachment={attachment}/>;
            }
          })}
        </ul>
        {this.state.showAttachmentView &&
        <AttachmentView onClose={this.onHiddenAttachment.bind(this)}
                        selectedAttachment={this.state.selectedAttachment}
                        attachments={this.props.attachments}/>
        }
      </div>
    );
  }
}
