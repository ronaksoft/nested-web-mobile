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

const style = require('./voice-comment.css');

/**
 * @interface IProps
 * @desc Interface of the component props
 */
interface IProps {
  comment: IComment;
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
}

/**
 * @class CommentsBoard
 * @desc A list of a post comment with a new comment input box
 * @extends {React.Component<IProps, IState>}
 */
class VoiceComment extends React.Component<IProps, IState> {

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
    };

  }

  /**
   * @func componentDidMount
   * @desc When the component has been mounted successfully, It retreives the post last 3 comments
   * and opens a channel for getting notified for new comments.
   * @memberof CommentsBoard
   * @override
   */
  public componentDidMount() {
    window.console.log('hey');
  }

  /**
   * @func componentWillUnmount
   * @desc Stops listening to the sync channels when the component is going to be destroyed
   * @memberof CommentsBoard
   * @override
   */
  public componentWillUnmount() {
    window.console.log('bye');
  }

  private onBarClick = () => {
    window.console.log('bye');
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
      <div className={style.voiceComment}>
        <div className={style.playVoice}>
          <IcoN size={16} name={'play'}/>
          <IcoN size={16} name={'pause'}/>
        </div>
        <div className={style.trailerVoice}>
          <SeekBar onBarClick={this.onBarClick} currentTime={2} isPlaying={true}/>
        </div>
      </div>
    );
  }
}

export default VoiceComment;
