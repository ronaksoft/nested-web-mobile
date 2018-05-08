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
  attachment: any;
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
export default class AudioThumbnail extends React.Component<IProps, IState> {
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
    this.props.getDownloadUrl(this.props.attachment._id).then((viewUrl) => {
      this.setState({
        viewUrl,
      });
    }).catch(console.log);
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
    const srcPoster: string = this.props.attachment.thumbs.pre ?
      FileUtiles.getThumbUrl(this.props.attachment.thumbs.pre) :
      '';
    return (
      <div style={{flexDirection: 'column'}}>
        {srcPoster.length > 0 && (
          <div style={{width: '192px', height: '192px', alignSelf: 'center', marginBottom: '16px'}}>
            <img src={srcPoster} style={{width: '192px', height: '192px', objFit: 'contain'}}/>
          </div>
        )}
        {this.state.viewUrl && (
          <audio controls={true} preload="auto">
            <source src={this.state.viewUrl} type={this.props.attachment.mimeType}/>
            Your browser does not support the audio element.
          </audio>
        )}
      </div>
    );
  }
}
