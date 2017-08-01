/**
 * @file scenes/compose/AttachmentList/Item/DocThumbnail/index.tsx
 * @author naamesteh < naamesteh@nested.me >
 * @description specially renders Documents type attachments
 * inside upload attachment in compose page
 *              Documented by:          Shayesteh Naeimabadi
 *              Date of documentation:  2017-08-01
 *              Reviewed by:            robzizo
 *              Date of review:         2017-08-01
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
 * @class DocThumbnail
 * @classdesc render the thumbnails of video attachments
 * @extends {React.Component<IProps, IState>}
 */
export default class DocThumbnail extends React.Component<IProps, IState> {

  /**
   * @constructor
   * Creates an instance of Sidebar.
   * @param {IProps} props
   * @memberof DocThumbnail
   */
  constructor(props) {
    super(props);
  }

  /**
   * renders the video preview in post card
   * @function
   * @returns {ReactElement} markup
   * @memberof DocThumbnail
   * @override
   * @generator
   */
  public render() {
    const {item} = this.props;
    const name = item.model ? item.model.name : item.name;
    return (
      <div key={item.id}>
        <div key={item.id} className={style.imageContainer}>
          <div className={style.filesTypesImages}>
            <div className={style.fileBadge + ' ' + style.fileBadgeDoc}>
              {FileUtil.getSuffix(name).toUpperCase()}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
