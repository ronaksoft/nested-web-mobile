/**
 * @file scenes/private/posts/components/comment/index.tsx
 * @author Sina Hosseini <ehosseiniir@gmail.com>
 * @description A comment-board component
 * @export CommentsBoard
 * Documented by:          Soroush Torkzadeh <sorousht@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import IComment from 'api/comment/interfaces/IComment';
import {IcoN} from '../../../../../components/Icons';
import SeekBar from '../SeekBar';
import MiniPlayer from '../../../../../../app/services/miniplayer';
import AttachmentApi from '../../../../../api/attachment';
import FileUtil from '../../../../../services/utils/file';
import IPost from '../../../../../api/post/interfaces/IPost';
import * as _ from 'lodash';

const style = require('./voice-comment.css');

/**
 * @interface IProps
 * @desc Interface of the component props
 */
interface IProps {
  comment: IComment;

  /**
   * @prop post
   * @desc The post that the comments belogs to
   * @type {IPost}
   * @memberof IProps
   */
  post: IPost;
}

/**
 * @interface IState
 * @desc Interface of the component state
 */
interface IState {
  /**
   * @prop comments
   * @desc A list of comments on the board
   * @type {IComment}
   * @memberof IState
   */
  comment: IComment;

  ratio: number;

  play: boolean;
}

/**
 * @class CommentsBoard
 * @desc A list of a post comment with a new comment input box
 * @extends {React.Component<IProps, IState>}
 */
class VoiceComment extends React.Component<IProps, IState> {
  private miniPlayer: any;
  private eventReferences: any[];
  private currentPlayingId: string;
  /**
   * @constructor
   * Creates an instance of CommentsBoard.
   * @param {IProps} props
   * @memberof CommentsBoard
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      comment: null,
      ratio: 0.0,
      play: false,
    };
    this.miniPlayer = MiniPlayer.getInstance();
    this.eventReferences = [];
    this.eventReferences.push(this.miniPlayer.timeChanged((t) => {
      if (this.currentPlayingId !== this.props.comment._id) {
        return;
      }
      this.setState({
        ratio: t.ratio,
      });
    }));
    this.eventReferences.push(this.miniPlayer.statusChanged((result) => {
      if (result.status === 'play' || result.status === 'end') {
        this.currentPlayingId = result.id;
      }

      if (result.status === 'play' || result.status === 'pause' || result.status === 'end') {
        this.setState({
          play: (result.status === 'play' && this.currentPlayingId === this.props.comment._id),
        });
      }

      if (this.currentPlayingId === this.props.comment._id && result.status === 'end') {
        this.setState({
          ratio: 1.0,
        });
        this.miniPlayer.next();
      }
    }));
  }

  /**
   * @func componentDidMount
   * @memberof CommentsBoard
   * @override
   */
  public componentDidMount() {
    this.addVoiceTrack(this.props.comment, this.props.post._id);
  }

  /**
   * @func componentWillUnmount
   * @memberof CommentsBoard
   * @override
   */
  public componentWillUnmount() {
    _.forEach(this.eventReferences, (canceler) => {
      if (_.isFunction(canceler)) {
        canceler();
      }
    });
  }

  private onBarClick = (ratio) => {
    this.miniPlayer.seekTo(ratio);
  }

  /**
   * generates download url of attachment and update component state `downloadUrl` property
   * @function setDownloadUrl
   * @param {IComment} comment
   * @param {string} postId
   * @memberof CommentsBoard
   */
  public addVoiceTrack(comment: IComment, postId: string): void {
    AttachmentApi.getDownloadToken({
      universal_id: comment.attachment_id,
      post_id: postId,
    }).then((token: string) => {
      const item = {
        id: comment._id,
        src: FileUtil.getDownloadUrl(comment.attachment_id, token),
        isPlayed: false,
      };
      this.miniPlayer.addTrack(item, comment.sender, comment.timestamp);
    });
  }

  private onPlay = () => {
    if (!this.state.play) {
      this.miniPlayer.play(this.props.comment._id);
    } else {
      this.miniPlayer.pause();
    }
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof CommentsBoard
   * @generator
   */
  public render() {
    return (
      <div className={style.voiceComment + ' ' + (this.state.play ? style.isPlay : '')}>
        <div className={style.playVoice} onClick={this.onPlay}>
          <IcoN size={16} name={'play16'}/>
          <IcoN size={16} name={'pause16'}/>
        </div>
        <div className={style.trailerVoice}>
          <SeekBar onBarClick={this.onBarClick} ratio={this.state.ratio} isPlaying={true}/>
        </div>
      </div>
    );
  }
}

export default VoiceComment;
