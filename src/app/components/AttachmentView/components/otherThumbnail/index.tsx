import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
const style = require('../../../PostAttachment/postattachment.css');

interface IProps {
  attachment: IPostAttachment;
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
    return (
      <div className={[style.attachmentHolder, style[attachment.type]].join(' ')}>
        <div className={style.fileName}><p>{attachment.filename}</p></div>
        <div className={style.detail}>
          <p>{'extension'}</p>
          <span className={style.attsize}>{attachment.size}</span>
        </div>
      </div>
    );
  }
}
