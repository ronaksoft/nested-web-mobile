import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import AAA from '../../../../services/aaa/index';
import CONFIG from '../../../../config';

interface IProps {
  attachment: IPostAttachment;
  fullWidth: boolean;
}

interface IState {
  attachment: IPostAttachment;
}

export default class VideoThumbnail extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  public render() {
    const {attachment} = this.props;
    const src =
      `${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${this.props.fullWidth ? attachment.thumbs.pre : attachment.thumbs.x128}`;
    return (
      <li>
        <img src={src}
             style={{
               width: this.props.fullWidth ? '100%' : 'inherit',
               height: this.props.fullWidth ? 'inherit' : '96px',
             }}/>
      </li>
    );
  }
}
