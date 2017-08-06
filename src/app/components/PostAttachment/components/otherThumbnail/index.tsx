/**
 * @file component/PostAttachment/components/otherThumbnail/index.tsx
 * @author sinaa < sinaa@nested.me >
 * @description specially renders any type attachments except video and images inside post card
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import FileUtiles from '../../../../services/utils/file';
const style = require('../../postattachment.css');

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IPostAttachment} attachment
 * @property {function} onclick - callback click event to parent
 */
interface IProps {
  attachment: IPostAttachment;
  key: string;
  onclick: (attachment: IPostAttachment) => void;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IState {
  attachment: IPostAttachment;
}

/**
 * @export
 * @class OtherThumbnail
 * @classdesc render the thumbnails of attachments
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
   * renders the attachment element related to attachment type
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
      /** parent element define onClick function */
      <li key={attachment._id} onClick={this.props.onclick.bind(this, attachment)}>
        <div className={[style.attachmentHolder, style[attachment.type]].join(' ')}>
          <div className={style.fileName}><p>{attachment.filename}</p></div>
          <div className={style.detail}>
            <p>{ext}</p>
            <span className={style.attsize}>{attachment.size}</span>
          </div>
        </div>
      </li>
    );
  }
}
