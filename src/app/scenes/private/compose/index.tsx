import * as React from 'react';
import {Input, Icon} from 'antd';
import { Suggestion } from 'components';
const style = require('./compose.css');
interface IComposeProps {
  attachModal?: boolean;
}

interface IComposeState {
  attachModal?: boolean;
  unselectSelectedRecipient: number;
}
class Compose extends React.Component<IComposeProps, IComposeState> {

  constructor(props: any) {
    super(props);
  }

  public componentWillMount() {
    this.setState({
      attachModal: false,
      unselectSelectedRecipient: 0,
    });
  }
  private attachTypeSelect = () => {
    console.log('click');
    this.setState({
      attachModal: !this.state.attachModal,
      unselectSelectedRecipient: this.state.unselectSelectedRecipient + 1,
    });
  }
  private subjectFocus = () => {
    console.log('subjectFocus');
    this.setState({
      unselectSelectedRecipient: this.state.unselectSelectedRecipient + 1,
    });
  }
  private bodyFocus = () => {
    console.log('bodyFocus');
    this.setState({
      unselectSelectedRecipient: this.state.unselectSelectedRecipient + 1,
    });
  }
  private overlayClick = (event) => {
    event.stopPropagation();
  }

  public render() {
    return (
      <div className={style.compose}>
        <Suggestion selectedItems={[]} unselectSelectedRecipient={this.state.unselectSelectedRecipient}/>
        <div className={style.subject}>
          <Input onFocus={this.subjectFocus} placeholder="Add a Title…"/>
          <div onClick={this.attachTypeSelect}
          className={this.state.attachModal ? style.attachmentBtn + ' ' + style.attachActive : style.attachmentBtn}>
            <Icon type="link" />
            <div onClick={this.overlayClick} className={style.overlay}/>
            <div className={style.attachActions} onClick={this.overlayClick}>
              <Icon type="rocket" /><Icon type="car" /><Icon type="close"  onClick={this.attachTypeSelect}/>
            </div>
          </div>
        </div>
        <textarea onFocus={this.bodyFocus} placeholder="Write something…"/>
      </div>
    );
  }
}

export { Compose }
