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
import IPostAttachment from '../../../../api/post/interfaces/IPostAttachment';
import AAA from '../../../../services/aaa/index';
import CONFIG from '../../../../config';
import {IcoN} from 'components';
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
  key: string;
  attachment: IPostAttachment;
  fullWidth?: boolean;
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
    const height = window.innerWidth - 24 * ( attachment.height / attachment.width);
    return (
      <li style={{position: 'relative'}} key={attachment._id} onClick={this.props.onclick.bind(this, attachment)}>
        <img src={src}
             style={{
               width: this.props.fullWidth ? '100%' : 'inherit',
               height: this.props.fullWidth ? height + 'px' : '96px',
             }}/>
             <div style={{
                position: 'absolute',
                top: '50%', left: '50%',
                marginTop: '-8px',
                marginLeft: '-8px',
                width : '24px',
                height : '24px',
                padding: '4px',
                backgroundColor: 'black',
                borderRadius : '24px',
              }}>
               <IcoN size={16} name="play16White"/>
             </div>
      </li>
    );
  }
}
