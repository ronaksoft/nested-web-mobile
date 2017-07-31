/**
 * @file component/PostAttachment/components/videoThumbnail/index.tsx
 * @author sina < sinaa@nested.me >
 * @description specially renders videos thumbnail
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import FileUtil from 'services/utils/file';
// import IComposeAttachment from '../../../../../../api/post/interfaces/IComposeAttachment';
import IAttachmentItem from '../IAttachmentItem';
// import AAA from '../../../../../../services/aaa/index';
// import CONFIG from '../../../../../../config';

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IAttachmentItem} attachment - list of attachments
 * @property {boolean} fullWidth - does it need to render thumbnail in full width of screen
 */
interface IProps {
  item: IAttachmentItem;
  fullWidth?: boolean;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IAttachmentItem} attachment
 */
interface IState {
  item: IAttachmentItem;
}

/**
 * TODO : render should like imageSingle component if full width is true
 * @export
 * @class VideoThumbnail
 * @classdesc render the thumbnails of video attachments
 * @extends {React.Component<IProps, IState>}
 */
export default class VideoThumbnail extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {IProps} props
   * @memberof ImageThumbnail
   */
  constructor(props) {
    super(props);
  }

  /**
   * renders the video preview in post card
   * @function
   * @returns {ReactElement} markup
   * @memberof ImageThumbnail
   * @override
   * @generator
   */
  public render() {

    /**
     * @name attachment
     * @const
     * @type {object}
     */
    const {item} = this.props;

    /**
     * @name src
     * @const
     * @type {string}
     */
    return (
      <li key={item.id}>
        <img src={FileUtil.getViewUrl(this.props.item.model.thumbs.x64)}
             style={{
               width: this.props.fullWidth ? '40px' : 'inherit',
               height: this.props.fullWidth ? 'inherit' : '40px',
             }}/>
      </li>
    );
  }
}
