/**
 * @file component/PostAttachment/index.tsx
 * @author sina < ehosseinir@gmail.com >
 * @description view component to show attachments inside post card and control single view of each attachment
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            sina
 *              Date of review:         2017-07-27
 */
import * as React from 'react';
import {connect} from 'react-redux';
import IPostAttachment from '../../api/post/interfaces/IPostAttachment';
import AttachmentType from '../../api/attachment/constants/AttachmentType';
import ImageSingle from 'components/PostAttachment/components/imageSingle';
import ImageThumbnail from 'components/PostAttachment/components/imageThumbnail';
import OtherThumbnail from './components/otherThumbnail/index';
import VideoThumbnail from './components/videoThumbnail/index';
import {setCurrentAttachment, setCurrentAttachmentList,
  setCurrentPost} from '../../redux/attachment/actions/index';

const style = require('./postattachment.css');

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 */
interface IOwnProps {
  /**
   * @property {Array<IPostAttachment>} attachments - list of attachments
   * @desc routing state receive from react-router-redux
   * @type {array<IPostAttachment>}
   * @memberof IProps
   */
  attachments: IPostAttachment[];
  postId: string;
}
interface IProps {
  /**
   * @property {Array<IPostAttachment>} attachments - list of attachments
   * @desc routing state receive from react-router-redux
   * @type {array<IPostAttachment>}
   * @memberof IProps
   */
  attachments: IPostAttachment[];
  postId: string;
  currentAttachment: IPostAttachment[];
  currentAttachmentList: IPostAttachment[];
  setCurrentPost: (postId: string) => void;
  setCurrentAttachment: (attachment: IPostAttachment) => void;
  setCurrentAttachmentList: (attachments: IPostAttachment[]) => void;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 */
interface IState {
  /**
   * @property selectedAttachment
   * @desc selected attachment to show
   * @type {IPostAttachment | null}
   * @memberof IState
   */
  selectedAttachment: IPostAttachment | null;
}

/**
 * @class PostAttachment
 * @classdesc this class commiunicate with render components andattachments view
 * @extends {React.Component<IProps, IState>}
 */
class PostAttachment extends React.Component<IProps, IState> {

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
    });
    this.props.setCurrentPost(this.props.postId);
    this.props.setCurrentAttachment(attachment);
    this.props.setCurrentAttachmentList(this.props.attachments);
  }

  // /**
  //  * children component notifies component on close event
  //  * @private
  //  * @callback
  //  * @memberof PostAttachment
  //  */
  // private onHiddenAttachment() {
  //   this.setState({
  //     selectedAttachment: null,
  //     showAttachmentView: false,
  //   });
  // }

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
      (this.props.attachments[0].type === AttachmentType.IMAGE ||
        this.props.attachments[0].type === AttachmentType.GIF);
    return (
      <div>
        {/* attachments thumbnail */}
        {!singleImage && (
          <div className={[style.attachmentBar,
            this.props.attachments.length > 1 ? style.multiAttachment : ''].join(' ')}>
            <ul>
              {this.props.attachments.map((attachment: IPostAttachment) => {
                switch (attachment.type) {
                  case AttachmentType.GIF:
                  case AttachmentType.IMAGE:
                    return (
                      <ImageThumbnail key={attachment._id} onclick={this.showAttachment.bind(this, attachment)}
                                      attachment={attachment}/>
                    );
                  case AttachmentType.VIDEO:
                    return (
                      <VideoThumbnail key={attachment._id} onclick={this.showAttachment.bind(this, attachment)}
                                      fullWidth={this.props.attachments.length === 1}
                                      attachment={attachment}
                      />
                    );
                  default:
                    return (
                      <OtherThumbnail key={attachment._id} onclick={this.showAttachment.bind(this, attachment)}
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
            <ImageSingle key={this.props.attachments[0]._id}
                         onclick={this.showAttachment.bind(this, this.props.attachments[0])}
                         attachment={this.props.attachments[0]}/>
          </div>
        )}
      </div>
    );
  }
}

/**
 * redux store mapper
 * @param store
 */
const mapStateToProps = (store, ownProps: IOwnProps) => ({
  currentAttachment: store.attachments.currentAttachment,
  currentAttachmentList: store.attachments.currentAttachmentList,
  attachments: ownProps.attachments,
  postId: ownProps.postId,
});

/**
 * reducer actions functions mapper
 * @param dispatch
 * @returns reducer actions object
 */
const mapDispatchToProps = (dispatch) => {
  return {
    setCurrentAttachment: (attach: IPostAttachment) => {
      dispatch(setCurrentAttachment(attach));
    },
    setCurrentAttachmentList: (attachs: IPostAttachment[]) => {
      dispatch(setCurrentAttachmentList(attachs));
    },
    setCurrentPost: (postId: string) => {
      dispatch(setCurrentPost(postId));
    },
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(PostAttachment);
