/**
 * @file scenes/compose/AttachmentList/Item/otherThumbnail/index.tsx
 * @author naamesteh < naamesteh@nested.me >
 * @description specially renders any type attachments except video and images
 * inside upload attachment in compose page
 *              Documented by:          Shayesteh Naeimabadi
 *              Date of documentation:  2017-08-01
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IAttachmentItem from '../IAttachmentItem';
import FileUtil from 'services/utils/file';
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
      <div key={item.id}>
            <div key={item.id} className={style.imageContainer}>
              <div className={style.filesTypesImages}>
                <div className={style.fileBadge}>
                  {FileUtil.getSuffix(this.props.item.model.name).toUpperCase()}
                </div>
              </div>
            </div>
      </div>
    );
  }
}
