/**
 * @file component/PostAttachment/components/videoThumbnail/index.tsx
 * @author sina < sinaa@nested.me >
 * @description specially renders videos thumbnail
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-25
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import IComposeAttachment from '../../../../../../api/post/interfaces/IComposeAttachment';
import AAA from '../../../../../../services/aaa/index';
import CONFIG from '../../../../../../config';

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IPostAttachment} attachment - list of attachments
 * @property {boolean} fullWidth - does it need to render thumbnail in full width of screen
 * @property {function} onclick - callback click event to parent
 */
interface IProps {
  attachment: IComposeAttachment;
  fullWidth?: boolean;
  onclick: (attachment: IComposeAttachment) => void;
}

/**
 * @name IState
 * @interface IState for component reactive Elements
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IState {
  attachment: IComposeAttachment;
}

/**
 * TODO : render should like imageSingle component if full width is true
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
    const {attachment} = this.props;

    /**
     * @name src
     * @const
     * @type {string}
     */
    const src =
      `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
      `${this.props.fullWidth ? attachment.thumbs.pre : attachment.thumbs.x128}`;
    return (
      <li key={attachment._id} onClick={this.props.onclick.bind(this, attachment)}>
        <img src={src}
             style={{
               width: this.props.fullWidth ? '100%' : 'inherit',
               height: this.props.fullWidth ? 'inherit' : '96px',
             }}/>
      </li>
    );
  }
}
