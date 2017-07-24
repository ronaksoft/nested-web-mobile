/**
 * @file component/Attachmentview/components/videoThumbnail/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description specially renders videos
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-24
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import AAA from '../../../../services/aaa/index';
import CONFIG from '../../../../config';

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
 * @class VideoThumbnail
 * @classdesc render the videos for attachments view
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
   * renders the component
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
      `${attachment.thumbs.pre}`;
    return (
      <li>
        <img src={src}
             style={{
               width: '100%',
             }}/>
      </li>
    );
  }
}
