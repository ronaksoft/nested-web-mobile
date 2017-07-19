import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import AAA from '../../../../services/aaa/index';
import CONFIG from '../../../../config';

interface IProps {
  attachment: IPostAttachment;
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
      `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${attachment.thumbs.pre}`;
    return (
      <li>
        <img src={src}
             style={{
               width: '100%',
             }}/>
      </li>
    );
  }
}
