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

const style = require('./seek-bar.css');

/**
 * @interface IProps
 * @desc Interface of the component props
 */
interface IProps {
  onBarClick: () => void;
  currentTime: number;
  isPlaying: boolean;
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
  mouseDown: boolean;
  panX: number;
}

/**
 * @class CommentsBoard
 * @desc A list of a post comment with a new comment input box
 * @extends {React.Component<IProps, IState>}
 */
class SeekBar extends React.Component<IProps, IState> {
  private barWidth;
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
      mouseDown: false,
      panX: 0,
    };
    window.addEventListener('mousemove', this.mouseMove);
    window.addEventListener('mouseup', this.mouseUp);
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
    window.removeEventListener('mousemove', this.mouseMove);
    window.removeEventListener('mouseup', this.mouseUp);
  }

  private mouseDown = () => {
    this.setState({
      mouseDown: true,
    });
  }

  private mouseUp = () => {
    this.setState({
      mouseDown: false,
    });
  }

  private mouseMove = (e) => {
    if (this.state.mouseDown) {
      let range = e.pageX - 68;
      if (range < 0) {
        range = 0;
      }
      if (range > this.barWidth) {
        range = this.barWidth;
      }
      this.setState({
        panX: range,
      });
    }
  }

  /**
   * @func refHandler
   * @desc handler for html emails
   * @private
   * @memberof Compose
   * @param {HTMLDivElement} value
   */
  private refHandler = (value) => {
    this.barWidth = value.clientWidth - 24;
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof CommentsBoard
   * @generator
   */
  public render() {
    const draggerStyle = {
      left: this.state.panX + 'px',
    };
    const playedBarStyle = {
      width: this.state.panX * 2 + 'px',
    };
    return (
      <div className={style.playerHandler + ' ' + (this.state.mouseDown ? style.noTransition : '')}>
        <div className={style.bgBar} ref={this.refHandler}/>
        <div className={style.playedBar} style={playedBarStyle}/>
        <div className={style.playerDragger} onMouseDown={this.mouseDown} style={draggerStyle}/>
      </div>
    );
  }
}

export default SeekBar;
