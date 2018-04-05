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
import FileUtiles from '../../../../services/utils/file';

/**
 * @name IProps
 * @interface IProps for component initials data
 * This interface pass the required parameters to component.
 * @type {object}
 * @property {IPostAttachment} attachment
 */
interface IProps {
  attachmentId: string;
  getDownloadUrl: (id: string) => any;
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
      viewUrl: '',
    };
  }

  public componentDidMount() {
    this.props.getDownloadUrl(this.props.attachmentId).then((viewUrl) => {
      this.setState({
        viewUrl,
      });
    });
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

    /**
     * preview image
     * @name srcPoster
     * @var
     * @type {string}
     */
    const srcPoster: string = FileUtiles.getViewUrl(this.props.attachmentId);
    return (
      <div>
        {this.state.viewUrl && (
          <video width="100%" controls={true} preload="auto" poster={srcPoster}>
            <source src={this.state.viewUrl} type="video/mp4" />
            Your browser does not support HTML5 video.
          </video>
        )}
      </div>
    );
  }
}
