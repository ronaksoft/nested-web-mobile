/**
 * @file component/PostAttachment/components/imageThumbnail/index.tsx
 * @author sina < sinaa@nested.me >
 * @description specially renders images preview
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import AAA from '../../../../services/aaa/index';
import CONFIG from '../../../../config';
import {IAttachment} from 'api/interfaces';

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
  onclick: (attachment: IAttachment) => void;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IState {
  urlSrc: string;
}

/**
 * @export
 * @class ImageThumbnail
 * @classdesc render the thumbnails of attachments
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
   * renders the attachment element related to attachment type
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
    const {attachment} = this.props;

    /**
     * @name src
     * @const
     * @type {string}
     */
    const src =
      `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${attachment.thumbs.x128}`;
    return (
      <li key={attachment._id} onClick={this.props.onclick.bind(this, attachment)}>
        <img src={src}
             style={{
               width: 'inherit',
               height: '96px',
             }}/>
      </li>
    );
  }
}
