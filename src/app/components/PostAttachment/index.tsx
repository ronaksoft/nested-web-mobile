/**
 * @file component/PostAttachment/index.tsx
 * @author sina < sinaa@nested.me >
 * @description view component for attachments inside post card
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageSingle from 'components/PostAttachment/components/imageSingle';
import ImageThumbnail from 'components/PostAttachment/components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import AttachmentView from '../AttachmentView/index';

const style = require('./postattachment.css');

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {Array<IPostAttachment>} attachments - list of attachments
 */
interface IProps {
  attachments: IPostAttachment[];
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IPostAttachment} selectedAttachment -
 * @property {boolean} showAttachmentView - a flag for AttachmentView active state
 */
interface IState {
  selectedAttachment: IPostAttachment | null;
  showAttachmentView: boolean;
}

/**
 * @class PostAttachment
 * @classdesc this class commiunicate with render components andattachments view
 * @extends {React.Component<IProps, IState>}
 */
export default class PostAttachment extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {IProps} props
   * @memberof PostAttachment
   */
  constructor(props: IProps) {
    super(props);

    /**
     * @default initial state of component
     */
    this.state = {
      selectedAttachment: null,
      showAttachmentView: false,
    };
  }

  /**
   * open AttachmentView for attachment
   * @private
   * @param {IPostAttachment} attachment - picked up attachment for view
   * @memberof PostAttachment
   */
  private showAttachment(attachment: IPostAttachment) {
    this.setState({
      selectedAttachment: attachment,
      showAttachmentView: true,
    });
  }

  /**
   * children component notifies component on close event
   * @private
   * @callback
   * @memberof PostAttachment
   */
  private onHiddenAttachment() {
    this.setState({
      selectedAttachment: null,
      showAttachmentView: false,
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof PostAttachment
   * @override
   * @generator
   */
  public render() {

    /**
     * Checks the attachments to know to render `SingleImage` component or no
     * @name singleImage
     * @const
     * @type {boolean}
     */
    const singleImage = this.props.attachments.length === 1 &&
    ( this.props.attachments[0].type === AttachmentType.IMAGE ||
    this.props.attachments[0].type === AttachmentType.GIF );
    return (
      <div>
        {/* attachments thumbnail */}
        {!singleImage && (
          <div className={style.attachmentBar}>
            <ul>
              {this.props.attachments.map((attachment: IPostAttachment) => {
                switch (attachment.type) {
                  case AttachmentType.GIF:
                  case AttachmentType.IMAGE:
                    return (
                      <ImageThumbnail onclick={this.showAttachment.bind(this, attachment)}
                                          attachment={attachment}/>
                    );
                  case AttachmentType.VIDEO:
                    return (
                      <VideoThumbnail onclick={this.showAttachment.bind(this, attachment)}
                                          fullWidth={this.props.attachments.length === 1}
                                          attachment={attachment}/>
                    );
                  default:
                    return (
                      <OtherThumbnail onclick={this.showAttachment.bind(this, attachment)}
                                          attachment={attachment}/>
                    );
                }
              })}
            </ul>
          </div>
        )}
        {/* renders for attachments contain only one image */}
        {singleImage && (
          <div className={style.singleImage}>
            <ImageSingle onclick={this.showAttachment.bind(this, this.props.attachments[0])}
              attachment={this.props.attachments[0]}/>
          </div>
        )}
        {/* Attachments modal view component */}
        {this.state.showAttachmentView && (
        <AttachmentView onClose={this.onHiddenAttachment.bind(this, '')}
                        selectedAttachment={this.state.selectedAttachment}
                        attachments={this.props.attachments}/>
        )}
      </div>
    );
  }
}
