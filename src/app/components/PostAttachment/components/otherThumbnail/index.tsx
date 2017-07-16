import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
const style = require('../../postattachment.css');

interface IProps {
  attachment: IPostAttachment;
  onclick: (attachment: IPostAttachment) => void;
}

interface IState {
  attachment: IPostAttachment;
}

export default class OtherThumbnail extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  public render() {
    const {attachment} = this.props;
    console.log(attachment.type);
    return (
      <li key={attachment._id} onClick={this.props.onclick.bind(this, attachment)}>
        <div className={[style.attachmentHolder, style[attachment.type]].join(' ')}>
          <div className={style.fileName}><p>{attachment.filename}</p></div>
          <div className={style.detail}>
            <p>{'extension'}</p>
            <span className={style.attsize}>{attachment.size}</span>
          </div>
        </div>
      </li>
    );
  }
}
