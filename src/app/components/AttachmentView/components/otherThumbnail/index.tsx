import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';

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
      <li key={attachment._id}>
        {attachment.filename}
        {attachment.type}
      </li>
    );
  }
}
