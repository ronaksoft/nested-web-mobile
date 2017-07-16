import * as React from 'react';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageThumbnail from 'components/PostAttachment/components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';

const style = require('./postattachment.css');

interface IProps {
  attachments: IPostAttachment[];
}

interface IState {
  selectedAttachment: IPostAttachment;
}

export default class PostAttachment extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div className={style.attachmentBar}>
        <ul>
          {this.props.attachments.map((attachment: IPostAttachment) => {
            switch (attachment.type) {
              case AttachmentType.GIF:
              case AttachmentType.IMAGE:
                return <ImageThumbnail fullWidth={this.props.attachments.length === 1} attachment={attachment}/>;
              case AttachmentType.VIDEO:
                return <VideoThumbnail fullWidth={this.props.attachments.length === 1} attachment={attachment}/>;
              default:
                return <OtherThumbnail attachment={attachment}/>;
            }
          })}
        </ul>
      </div>
    );
  }
}
