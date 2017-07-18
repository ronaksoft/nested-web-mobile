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

export default class ImageSingle extends React.Component<IProps, IState> {
  constructor(props) {
    super(props);
  }

  public render() {
    const {attachment} = this.props;
    const width: number = attachment.width < window.innerWidth ? attachment.width : window.innerWidth - 32;
    const height: number = (attachment.height / attachment.width) * width;
    const src =
      `${CONFIG.STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${attachment.thumbs.pre}`;
    return (
      <div onClick={this.props.onclick.bind(this, attachment)}>
        <img src={src} style={{
          width: width + 'px',
          height: height + 'px',
        }}/>
      </div>
    );
  }
}
