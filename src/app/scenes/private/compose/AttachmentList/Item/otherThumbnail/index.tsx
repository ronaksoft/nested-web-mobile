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
// import IComposeAttachment from '../../../../../../api/post/interfaces/IComposeAttachment';
import IAttachmentItem from '../IAttachmentItem';
const style = require('../composeAttachment.css');

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IPostAttachment} attachment
 * @property {function} onclick - callback click event to parent
 */
interface IProps {
  item: IAttachmentItem;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IState {
  item: IAttachmentItem;
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
    const {item} = this.props;
    return (
      /** parent element define onClick function */
      <li key={item.id}>
        <div className={[style.attachmentHolder, style[item.type]].join(' ')}>
          <div className={style.fileName}><p>{item.name}</p></div>
          <div className={style.detail}>
            <p>{'extension'}</p>
            <span className={style.attsize}>{item.size}</span>
          </div>
        </div>
      </li>
    );
  }
}
