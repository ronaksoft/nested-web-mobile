/**
 * @file component/PostAttachment/components/imageSingle/index.tsx
 * @author sina < sinaa@nested.me >
 * @description specially renders images preview of single image posts
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
  key: string;
  attachment: IPostAttachment;
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
export default class ImageSingle extends React.Component<IProps, IState> {

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
   * renders the image preview fit into post card size and original aspect ratio
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
     * @name width
     * @desc resize the wide images width to the lower than screen width
     * @const
     * @type {number}
     */
    const width: number = attachment.width < window.innerWidth ? attachment.width : window.innerWidth - 32;

    /**
     * @name height
     * @desc calculate height of image by using new width
     * @const
     * @type {number}
     */
    const height: number = (attachment.height / attachment.width) * width;

    /**
     * @name src
     * @const
     * @type {string}
     */
    const src =
      `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${attachment.thumbs.pre}`;
    return (
      <div onClick={this.props.onclick.bind(this, attachment)}>
        <img src={src} style={{
          width: width + 'px',
          height: height + 'px',
        }}/>
      </div>
    );
  }
}
