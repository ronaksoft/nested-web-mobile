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
import AttachmentApi from 'api/attachment';

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
 * @property {viewUrl} viewUrl - source url of video
 */
interface IState {
  viewUrl: string;
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
    this.state = {
      viewUrl : '',
    };
  }

  private viewUrl() {
    AttachmentApi.getDownloadToken({
        universal_id: this.props.attachment._id,
      }).then((token: string) => {
        this.setState({
          viewUrl : `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
              `${this.props.attachment._id}/${token}`,
        });
      });
  }

  public componentDidMount() {
    this.viewUrl();
    // this.refs.videoEl.load();
    setTimeout(() => {
      // $('#ali').load();
    }, 1000);
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
     * preview image
     * @name srcPoster
     * @var
     * @type {string}
     */
    const srcPoster: string = `${CONFIG().STORE.URL}/view/${AAA.getInstance().getCredentials().sk}/` +
    `${attachment.thumbs.pre}/`;
    return (
      <li>
        <video id="ali" width="100%" controls={true} preload="auto" poster={srcPoster}>
          <source src={this.state.viewUrl} type="video/mp4" />
          Your browser does not support HTML5 video.
        </video>
      </li>
    );
  }
}
