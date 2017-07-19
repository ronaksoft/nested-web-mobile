import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import AAA from '../../../../services/aaa/index';
import CONFIG from '../../../../config';
import IAttachment from '../../../../api/attachment/interfaces/IAttachment';

interface IProps {
  attachment: IPostAttachment;
  onclick: (attachment: IAttachment) => void;
}

interface IState {
  urlSrc: string;
}

export default class ImageThumbnail extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  public render() {
    const {attachment} = this.props;
    const src =
      `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${attachment.thumbs.x128}`;
    return (
      <li key={attachment._id} onClick={this.props.onclick.bind(this, attachment)}>
        <img src={src}
             style={{
               width: 'inherit',
               height: '96px',
             }}/>
      </li>
    );
  }
}
