import * as React from 'react';
import * as Hammer from 'react-hammerjs';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageThumbnail from './components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import {IcoN} from 'components';
import AAA from '../../services/aaa/index';
import CONFIG from '../../config';

const style = require('./attachmentview.css');
interface IProps {
  attachments: IPostAttachment[];
  selectedAttachment?: IPostAttachment | null;
  onClose: () => void;
}

interface IState {
  selectedAttachment: IPostAttachment;
  attachments: IPostAttachment[];
}

export default class AttachmentView extends React.Component<IProps, IState> {
  private haveNext: boolean;
  private havePrev: boolean;
  private indexOfAttachment: number;
  private panStart: boolean;
  private panDistance: number;
  constructor(props: IProps) {
    super(props);
    this.state = {
      selectedAttachment: this.props.selectedAttachment,
      attachments: this.props.attachments,
    };
    this.inIt();
  }

  public inIt() {
    this.indexOfAttachment = this.getIndexOfAttachment();
    this.haveNext = this.indexOfAttachment < this.props.attachments.length - 1;
    this.havePrev = this.indexOfAttachment <= this.props.attachments.length - 1 && this.indexOfAttachment > 0;
    console.log('inIt', this.indexOfAttachment, this.haveNext, this.havePrev);
}

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      attachments: newProps.attachments,
    });
    this.inIt();
  }

  private getIndexOfAttachment() {
    const indexOfAttachment = this.state.attachments.findIndex((attachment: IPostAttachment) => {
      return attachment._id === this.state.selectedAttachment._id;
    });
    return indexOfAttachment;
  }

  private next() {
    const indexOfAttachment = this.getIndexOfAttachment();

    if (this.state.attachments.length - 1 === indexOfAttachment) {
      this.setState({selectedAttachment: this.state.attachments[0]});
    } else if (this.props.attachments.length - 1 > indexOfAttachment) {
      this.setState({selectedAttachment: this.state.attachments[indexOfAttachment + 1]});
    }
    this.inIt();
  }

  private prev() {
    const indexOfAttachment = this.getIndexOfAttachment();

    if (indexOfAttachment > 0) {
      this.setState({selectedAttachment: this.state.attachments[indexOfAttachment - 1]});
    } else {
      this.setState({selectedAttachment: this.state.attachments[this.state.attachments.length - 1]});
    }
    this.inIt();
  }

  // private onSwipe(event: any, props: any) {
  //   console.log(props, event);
  //   if (props.direction === 2) {
  //     // this.next();
  //   } else if (props.direction === 4) {
  //     // this.prev();
  //   }
  // }

  private onPan(event: any, props: any) {
    console.log(props, event);
    // const toLeft = props.direction === 2;
    // const toRight = props.direction === 4;

    const indexOfAttachment = this.getIndexOfAttachment();
    const haveNext = indexOfAttachment < this.props.attachments.length - 1;
    const havePrev = indexOfAttachment <= this.props.attachments.length - 1 && indexOfAttachment > 0;
    let trailed = props.deltaX / window.innerWidth;

    this.panDistance = trailed;

    if ( haveNext && this.panDistance < 0 ) {
      console.log('go Next');
      trailed = 1 + trailed;
      trailed = trailed * 100;
      document.getElementById('next').style.transform = 'translateX(' + trailed + '%)';
      document.getElementById('current').style.transform = 'translateX(' + this.panDistance * 100 + '%)';
    }
    if ( havePrev && this.panDistance > 0 ) {
      console.log('go Previous');
      trailed = (1 - trailed) * -100;
      document.getElementById('prv').style.transform = 'translateX(' + trailed + '%)';
      document.getElementById('current').style.transform = 'translateX(' + this.panDistance * 100 + '%)';
    }
  }

  private onPanStart(event: any, props: any) {
    console.log('onPanStart', props, event);
    this.panStart = true;
  }

  private onPanEnd(event: any, props: any) {
    console.log('onPanEnd', props, event);
    if ( this.haveNext && this.panDistance < 0 ) {
      console.log('go Next');
      let trailed = this.panDistance;
      trailed = 1 + trailed;
      trailed = trailed * 100;
      if ( trailed < 70 ) {
        this.next();
      }
    }
    if ( this.havePrev && this.panDistance > 0 ) {
      console.log('go Previous');
      let trailed = this.panDistance;
      trailed = (1 - trailed) * -100;
      if ( trailed > -70 ) {
        this.prev();
      }
    }
    document.getElementById('current').style.transform = '';
    if ( document.getElementById('next') ) {
      document.getElementById('next').style.transform = '';
    }
    if ( document.getElementById('prv') ) {
      document.getElementById('prv').style.transform = '';
    }
    this.panDistance = 0;
  }

  public render() {
    const indexOfAttachment = this.getIndexOfAttachment();
    const next = indexOfAttachment < this.props.attachments.length - 1;
    const prv = indexOfAttachment <= this.props.attachments.length - 1 && indexOfAttachment > 0;
    let prvElement;
    let nextElement;
    if ( prv ) {
      prvElement = (
        <main id="prv" className={style.prvItem}>
          {(this.state.attachments[indexOfAttachment - 1].type === AttachmentType.GIF ||
            this.state.attachments[indexOfAttachment - 1].type === AttachmentType.IMAGE) &&
          <ImageThumbnail attachment={this.state.attachments[indexOfAttachment - 1]}/>
          }
          {this.state.attachments[indexOfAttachment - 1].type === AttachmentType.VIDEO &&
          <VideoThumbnail attachment={this.state.attachments[indexOfAttachment - 1]}/>
          }
          {this.state.attachments[indexOfAttachment - 1].type !== AttachmentType.GIF &&
          this.state.attachments[indexOfAttachment - 1].type !== AttachmentType.IMAGE &&
          this.state.attachments[indexOfAttachment - 1].type !== AttachmentType.VIDEO &&
          <OtherThumbnail attachment={this.state.attachments[indexOfAttachment - 1]}/>
          }
        </main>
      );
    }
    if ( next ) {
      nextElement = (
        <main id="next" className={style.nextItem}>
          {(this.state.attachments[indexOfAttachment + 1].type === AttachmentType.GIF ||
            this.state.attachments[indexOfAttachment + 1].type === AttachmentType.IMAGE) &&
          <ImageThumbnail attachment={this.state.attachments[indexOfAttachment + 1]}/>
          }
          {this.state.attachments[indexOfAttachment + 1].type === AttachmentType.VIDEO &&
          <VideoThumbnail attachment={this.state.attachments[indexOfAttachment + 1]}/>
          }
          {this.state.attachments[indexOfAttachment + 1].type !== AttachmentType.GIF &&
          this.state.attachments[indexOfAttachment + 1].type !== AttachmentType.IMAGE &&
          this.state.attachments[indexOfAttachment + 1].type !== AttachmentType.VIDEO &&
          <OtherThumbnail attachment={this.state.attachments[indexOfAttachment + 1]}/>
          }
        </main>
      );
    }
    const dlUrl =
      `${CONFIG.STORE.URL}/download/${AAA.getInstance().getCredentials().sk}/` +
      `${this.state.selectedAttachment._id}`;
    return (
      <div
        id={'attachment-view'}
        className={style.attachmentView}
      >
        <div className={style.navigation}>
          <a onClick={this.props.onClose}>
            <IcoN size={24} name={'xcross24White'}/>
          </a>
          <span>
            {indexOfAttachment + 1} of {this.state.attachments.length}
          </span>
        </div>
        <Hammer id="current" onPan={this.onPan.bind(this, '')} onPanEnd={this.onPanEnd.bind(this, '')}
        onPanStart={this.onPanStart.bind(this, '')} direction="DIRECTION_ALL">
          <div>
            {(this.state.selectedAttachment.type === AttachmentType.GIF ||
              this.state.selectedAttachment.type === AttachmentType.IMAGE) &&
            <ImageThumbnail attachment={this.state.selectedAttachment}/>
            }
            {this.state.selectedAttachment.type === AttachmentType.VIDEO &&
            <VideoThumbnail attachment={this.state.selectedAttachment}/>
            }
            {this.state.selectedAttachment.type !== AttachmentType.GIF &&
            this.state.selectedAttachment.type !== AttachmentType.IMAGE &&
            this.state.selectedAttachment.type !== AttachmentType.VIDEO &&
            <OtherThumbnail attachment={this.state.selectedAttachment}/>
            }
          </div>
        </Hammer>
        <div className={style.footer}>
          <div>
            <p>{this.state.selectedAttachment.filename}</p>
            {(this.state.selectedAttachment.type === AttachmentType.GIF ||
              this.state.selectedAttachment.type === AttachmentType.IMAGE) ? (
              <span>Original Image:
                {/*{this.state.selectedAttachment.size} kb,*/}
                {this.state.selectedAttachment.height} × {this.state.selectedAttachment.width}</span>
            ) : (
              <span>
                {/*{this.state.selectedAttachment.size} kb*/}
              </span>
            )}
          </div>
          <a href={dlUrl} target="_blank" onClick={this.props.onClose}>
            <IcoN size={24} name={'downloads24White'}/>
          </a>
        </div>
        {prv && prvElement}
        {next && nextElement}
      </div>
    );
  }
}
