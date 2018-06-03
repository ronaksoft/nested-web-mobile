/**
 * @file scenes/compose/AttachmentList/Item/videoThumbnail/index.tsx
 * @author naamesteh < naamesteh@nested.me >
 * @description specially renders Video type attachments
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
 * @class VideoThumbnail
 * @classdesc render the thumbnails of video attachments
 * @extends {React.Component<IProps, IState>}
 */
export default class VideoThumbnail extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {IProps} props
   * @memberof VideoThumbnail
   */
  constructor(props) {
    super(props);
  }

  /**
   * renders the video preview in post card
   * @function
   * @returns {ReactElement} markup
   * @memberof VideoThumbnail
   * @override
   * @generator
   */
  public render() {
    const {item} = this.props;
    const hasThumb = item.model && item.model.thumbs.x64;
    return (
    <div key={item.id}>
      {
        hasThumb ?
        (
          <img src={FileUtil.getViewUrl(this.props.item.model.thumbs.x64)}
             style={{width: 40, height: 40}}
          />
        ) :
        (
          <div key={item.id} className={style.imageContainer}>
            <div className={style.filesTypesImages}>
              <div className={style.fileBadge + ' ' + style.fileBadgeVid}>
                VID
              </div>
            </div>
          </div>
        )
      }
    </div>
    );
  }
}
