/**
 * @file component/Attachmentview/components/otherThumbnail/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description specially renders any type attachments except video and images
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import FileUtiles from '../../../../services/utils/file';
const style = require('../../../PostAttachment/postattachment.css');

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IProps {
  attachment: IPostAttachment;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {string} urlSrc - source url of image
 */
interface IState {
  attachment: IPostAttachment;
}

/**
 * @export
 * @class OtherThumbnail
 * @classdesc render the thumbnails card for attachments view
 * @extends {React.Component<IProps, IState>}
 */
export default class OtherThumbnail extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {IProps} props
   * @memberof OtherThumbnail
   */
  constructor(props) {
    super(props);
  }

  /**
   * renders the attachments card related to attachment type
   * @function
   * @returns {ReactElement} markup
   * @memberof OtherThumbnail
   * @override
   * @generator
   */
  public render() {

    /**
     * @name attachment
     * @const
     * @type {object}
     */
    const {attachment} = this.props;
    const ext = FileUtiles.getSuffix(attachment.filename);
    return (
      <div className={[style.attachmentHolder, style[attachment.type]].join(' ')}>
        <div className={style.fileName}><p>{attachment.filename}</p></div>
        <div className={style.detail}>
          <p>{ext}</p>
          <span className={style.attsize}>{attachment.size}</span>
        </div>
      </div>
    );
  }
}
