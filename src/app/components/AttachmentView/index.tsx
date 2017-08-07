/**
 * @file component/AttachmentView/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Attachment view modal which accessable by clicking on attachments or files
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import * as Hammer from 'react-hammerjs';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageThumbnail from './components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import {IcoN} from 'components';
import AttachmentApi from 'api/attachment';
import FileUtil from 'services/utils/file';
import {message} from 'antd';

const style = require('./attachmentview.css');

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {Array<IPostAttachment>} attachments - list of attachments
 * @property {IPostAttachment} selectedAttachment - selected attachment
 * @property {function} onClose - close attachment view
 */
interface IProps {
  attachments: IPostAttachment[];
  selectedAttachment?: IPostAttachment | null;
  onClose: () => void;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {Array<IPostAttachment>} attachments - list of attachments
 * @property {IPostAttachment} selectedAttachment - selected attachment
 * @property {string} downloadUrl -  download url of selected attachment
 */
interface IState {
  attachments: IPostAttachment[];
  selectedAttachment: IPostAttachment;
  downloadUrl: string;
}

/**
 * @class AttachmentView
 * @classdesc view modal of all attachments. render component differs in different type of attachments
 * attachment
 * @extends {React.Component<IProps, IState>}
 * @requires [<IcoN>]
 */
export default class AttachmentView extends React.Component<IProps, IState> {

  /**
   * determine the selected attachment is last attachment or not
   * @name haveNext
   * @private
   * @type {boolean}
   * @memberof AttachmentView
   */
  private haveNext: boolean;

  /**
   * determine the selected attachment is first attachment or not
   * @name havePrev
   * @private
   * @type {boolean}
   * @memberof AttachmentView
   */
  private havePrev: boolean;

  /**
   * index of selected attachment in attachments
   * @name indexOfAttachment
   * @private
   * @type {number}
   * @memberof AttachmentView
   */
  private indexOfAttachment: number;

  /**
   * Start flag for paning
   * @name panStart
   * @private
   * @type {boolean}
   * @memberof AttachmentView
   */
  private panStart: boolean;

  /**
   * pan distance
   * @name panDistance
   * @private
   * @type {number}
   * @memberof AttachmentView
   */
  private panDistance: number;

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {IProps} props
   * @memberof AttachmentView
   */
  constructor(props: IProps) {
    super(props);

    /**
     * @default
     * @type {IState}
     */
    this.state = {
      selectedAttachment: this.props.selectedAttachment,
      attachments: this.props.attachments,
      downloadUrl: '',
    };

    // Binds `this` (the component context) as these functions context
    this.onPan = this.onPan.bind(this);
    this.onPanStart = this.onPanStart.bind(this);
    this.onPanEnd = this.onPanEnd.bind(this);
    this.setDownloadUrl = this.setDownloadUrl.bind(this);

    /**
     * call 'inIt' for set initial state of component
     */
    this.inIt();
  }

  /**
   * After mounting component, it calls `AttachmentView.setDownloadUrl`
   * @override
   * @function componentDidMount
   * @memberof AttachmentView
   */
  public componentDidMount() {
    this.setDownloadUrl(this.state.selectedAttachment._id);
  }

  /**
   * generates download url of attachment and update component state `downloadUrl` property
   * @function setDownloadUrl
   * @param {string} id
   * @memberof AttachmentView
   */
  public setDownloadUrl(id: string): void {
      AttachmentApi.getDownloadToken({
        universal_id: id,
      }).then((token: string) => {
        this.setState({
          downloadUrl: FileUtil.getDownloadUrl(id, token),
        });
      }, () => {
        this.setState({
          downloadUrl: null,
        });
      });
  }

  /**
   * determine some initial state for component like `AttachmentView.indexOfAttacment` and `AttachmentView.haveNext`
   * @public
   * @memberof AttachmentView
   */
  public inIt() {
    this.indexOfAttachment = this.getIndexOfAttachment();
    this.haveNext = this.indexOfAttachment < this.props.attachments.length - 1;
    this.havePrev = this.indexOfAttachment <= this.props.attachments.length - 1 && this.indexOfAttachment > 0;

    // reset the style attribiutes on each initialize
    if ( document.getElementById('current') ) {
      document.getElementById('current').style.transform = '';
    }
    if ( document.getElementById('next') ) {
      document.getElementById('next').style.transform = '';
    }
    if ( document.getElementById('prv') ) {
      document.getElementById('prv').style.transform = '';
    }
  }

  /**
   * updateing state on any change in passed data
   * @override
   * @function componentWillReceiveProps
   * @memberof AttachmentView
   */
  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      attachments: newProps.attachments,
    });
    this.inIt();
  }

  /**
   * get the index of selected attachment in attachments
   * @private
   * @returns {number}
   * @memberof AttachmentView
   */
  private getIndexOfAttachment() {
    const indexOfAttachment = this.state.attachments.findIndex((attachment: IPostAttachment) => {
      return attachment._id === this.state.selectedAttachment._id;
    });
    return indexOfAttachment;
  }

  /**
   * change the selected Attachment to next attachment of last selected attachment
   * , initilize component and regenerate Downloadurl
   * @private
   * @returns {number}
   * @memberof AttachmentView
   */
  private next() {
    const indexOfAttachment = this.getIndexOfAttachment();
    let next: IPostAttachment = null;

    // if its last attachment, select first item of attachments as selected
    if (this.state.attachments.length - 1 === indexOfAttachment) {
      next =  this.state.attachments[0];
    } else if (this.props.attachments.length - 1 > indexOfAttachment) {
      next = this.state.attachments[indexOfAttachment + 1];
    }
    this.setState({selectedAttachment: next}, () => {
      this.inIt();
    });
    this.setDownloadUrl(next._id);
  }

  /**
   * change the selected Attachment to prevous attachment of last selected attachment
   * , initilize component and regenerate Downloadurl
   * @private
   * @returns {number}
   * @memberof AttachmentView
   */
  private prev() {
    const indexOfAttachment = this.getIndexOfAttachment();
    let prev: IPostAttachment = null;

    // if its first attachment, select last item of attachments as selected
    if (indexOfAttachment > 0) {
      prev = this.state.attachments[indexOfAttachment - 1];
    } else {
      prev = this.state.attachments[this.state.attachments.length - 1];
    }
    this.setState({selectedAttachment: prev}, () => {
      this.inIt();
    });
    this.setDownloadUrl(prev._id);
  }

  // private onSwipe(event: any, props: any) {
  //   console.log(props, event);
  //   if (props.direction === 2) {
  //     // this.next();
  //   } else if (props.direction === 4) {
  //     // this.prev();
  //   }
  // }

  /**
   * Calls on pan move
   * Set pan distance in percents of screen width and assign it to `AttachmentView.panDistance`
   * @event
   * @private
   * @param {*} event
   * @memberof AttachmentView
   */
  private onPan(event: any) {

    /**
     * @name indexOfAttachment
     * @const
     * @type {number}
     */
    const indexOfAttachment = this.getIndexOfAttachment();

    /**
     * @name haveNext
     * @const
     * @type {bolean}
     */
    const haveNext = indexOfAttachment < this.props.attachments.length - 1;

    /**
     * @name havePrev
     * @const
     * @type {bolean}
     */
    const havePrev = indexOfAttachment <= this.props.attachments.length - 1 && indexOfAttachment > 0;

    /**
     * @name trailed
     * @var
     * @type {number}
     */
    let trailed = event.deltaX / window.innerWidth;

    this.panDistance = trailed;

    /**
     * translate the DOMS accordingly to the trailed distance
     */
    if ( haveNext && this.panDistance < 0 ) {
      trailed = 1 + trailed;
      trailed = trailed * 100;
      document.getElementById('next').style.transform = 'translateX(' + trailed + '%)';
      document.getElementById('current').style.transform = 'translateX(' + this.panDistance * 100 + '%)';
    }
    if ( havePrev && this.panDistance > 0 ) {
      trailed = (1 - trailed) * -100;
      document.getElementById('prv').style.transform = 'translateX(' + trailed + '%)';
      document.getElementById('current').style.transform = 'translateX(' + this.panDistance * 100 + '%)';
    }
  }

  /**
   * Calls on pan start
   * @event
   * @private
   * @memberof AttachmentView
   */
  private onPanStart() {
    this.panStart = true;
  }

  /**
   * Calls on pan end and calculate the pan distance to set next or previous attachment as selected
   * pan distance more than 30% of screen width slected attachment changes to next/previous item
   * @event
   * @private
   * @memberof AttachmentView
   */
  private onPanEnd() {
    if ( this.haveNext && this.panDistance < 0 ) {
      let trailed = this.panDistance;
      trailed = 1 + trailed;
      trailed = trailed * 100;
      if ( trailed < 70 ) {
        this.next();
      }
    }
    if ( this.havePrev && this.panDistance > 0 ) {
      let trailed = this.panDistance;
      trailed = (1 - trailed) * -100;
      if ( trailed > -70 ) {
        this.prev();
      }
    }

    /** resert vars and elements style  */
    document.getElementById('current').style.transform = '';
    if ( document.getElementById('next') ) {
      document.getElementById('next').style.transform = '';
    }
    if ( document.getElementById('prv') ) {
      document.getElementById('prv').style.transform = '';
    }
    this.panDistance = 0;
  }

  /**
   * @function
   * @throws {notLoaded} We are not able to serve the file, try again later.
   * @private
   * @param {*} e
   * @memberof AttachmentView
   */
  private download(e: any) {
    if (!this.state.downloadUrl) {
      message.error('We are not able to serve the file, try again later.');
      e.preventDefault();
    }
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof AttachmentView
   * @override
   * @generator
   */
  public render() {

    /**
     * @name indexOfAttachment
     * @const
     * @type {number}
     */
    const indexOfAttachment = this.getIndexOfAttachment();

    /**
     * @name next
     * @const
     * @type {boolean}
     */
    const next = indexOfAttachment < this.props.attachments.length - 1;

    /**
     * @name prv
     * @const
     * @type {boolean}
     */
    const prv = indexOfAttachment <= this.props.attachments.length - 1 && indexOfAttachment > 0;

    /** Define variables for previous and next elements */
    let prvElement;
    let nextElement;
    if ( prv ) {
      prvElement = (
        <main id="prv" className={style.prvItem}>
          {(this.state.attachments[indexOfAttachment - 1].type === AttachmentType.GIF ||
            this.state.attachments[indexOfAttachment - 1].type === AttachmentType.IMAGE) &&
          <ImageThumbnail attachment={this.state.attachments[indexOfAttachment - 1]}/>
          }
          {this.state.attachments[indexOfAttachment - 1].type === AttachmentType.VIDEO && (
          <div>
            <VideoThumbnail attachment={this.state.attachments[indexOfAttachment - 1]}/>
          </div>
          )}
          {this.state.attachments[indexOfAttachment - 1].type !== AttachmentType.GIF &&
          this.state.attachments[indexOfAttachment - 1].type !== AttachmentType.IMAGE &&
          this.state.attachments[indexOfAttachment - 1].type !== AttachmentType.VIDEO && (
            <div>
              <OtherThumbnail attachment={this.state.attachments[indexOfAttachment - 1]}/>
            </div>
          )}
        </main>
      );
    }
    if ( next ) {
      nextElement = (
        <main id="next" className={style.nextItem}>
          {(this.state.attachments[indexOfAttachment + 1].type === AttachmentType.GIF ||
            this.state.attachments[indexOfAttachment + 1].type === AttachmentType.IMAGE) && (
          <div>
            <ImageThumbnail attachment={this.state.attachments[indexOfAttachment + 1]}/>
          </div>
          )}
          {this.state.attachments[indexOfAttachment + 1].type === AttachmentType.VIDEO &&
          <VideoThumbnail attachment={this.state.attachments[indexOfAttachment + 1]}/>
          }
          {this.state.attachments[indexOfAttachment + 1].type !== AttachmentType.GIF &&
          this.state.attachments[indexOfAttachment + 1].type !== AttachmentType.IMAGE &&
          this.state.attachments[indexOfAttachment + 1].type !== AttachmentType.VIDEO && (
          <div>
            <OtherThumbnail attachment={this.state.attachments[indexOfAttachment + 1]}/>
          </div>
          )}
        </main>
      );
    }
    return (
      <div
        id={'attachment-view'}
        className={style.attachmentView}
      >
        {/* Attachment view navbar */}
        <div className={style.navigation}>
          {/* Attachment view close button */}
          <a onClick={this.props.onClose}>
            <IcoN size={24} name={'xcross24White'}/>
          </a>
          <span>
            {indexOfAttachment + 1} of {this.state.attachments.length}
          </span>
        </div>
        <Hammer id="current" onPan={this.onPan} onPanEnd={this.onPanEnd}
        onPanStart={this.onPanStart} direction="DIRECTION_ALL">
          <div className={style.currentItem}>
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
          {/* Attachment view download button */}
          <a onClick={this.download} href={this.state.downloadUrl}>
            <IcoN size={24} name={'downloads24White'}/>
          </a>
        </div>
        {prv && prvElement}
        {next && nextElement}
      </div>
    );
  }
}
