/**
 * @file scenes/compose/AttachmentList/Item/ImageThumbnail/index.tsx
 * @author naamesteh < naamesteh@nested.me >
 * @description specially renders Image type attachments
 * inside upload attachment in compose page
 *              Documented by:          Shayesteh Naeimabadi
 *              Date of documentation:  2017-08-01
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import FileUtil from 'services/utils/file';
import IAttachmentItem from '../IAttachmentItem';
const style = require('../composeAttachment.css');

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
 * @export
 * @class ImageThumbnail
 * @classdesc render the thumbnails of video attachments
 * @extends {React.Component<IProps, IState>}
 */
export default class ImageThumbnail extends React.Component<IProps, IState> {

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
    <div key={item.id}>
      {
        this.props.item.model &&
        (
          <img src={FileUtil.getViewUrl(this.props.item.model.thumbs.x64)}
             style={{width: 40, height: 40}}/>
        )
      }
      {
        !this.props.item.model && (
        <div key={item.id} className={style.imageContainer}>
          <div className={style.fileBadge + ' ' + style.fileBadgeImg}>
            IMG
          </div>
        </div>
        )
      }
    </div>
    );
  }
}
