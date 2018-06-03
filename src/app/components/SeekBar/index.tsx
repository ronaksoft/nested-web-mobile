/**
 * @file scenes/private/posts/components/comment/index.tsx
 * @author Sina Hosseini <ehosseiniir@gmail.com>
 * @description A comment-board component
 * @export SeekBar
 * Documented by:          Soroush Torkzadeh <sorousht@nested.me>
 * Date of documentation:  2017-07-27
 * Reviewed by:            robzizo <me@robzizo.ir>
 * Date of review:         2017-07-31
 */
import * as React from 'react';
import {IComment} from 'api/interfaces';

const style = require('./seek-bar.css');

/**
 * @interface IProps
 * @desc Interface of the component props
 */
interface IProps {
  onBarClick: (e: number) => void;
  ratio: number;
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
 * @class SeekBar
 * @desc A list of a post comment with a new comment input box
 * @extends {React.Component<IProps, IState>}
 */
class SeekBar extends React.Component<IProps, IState> {
  private barElem;
  private draggerElem;

  /**
   * @constructor
   * Creates an instance of SeekBar.
   * @param {IProps} props
   * @memberof SeekBar
   */
  constructor(props: IProps) {
    super(props);
    this.state = {
      comment: null,
      mouseDown: false,
      panX: 0,
    };
    window.addEventListener('touchmove', this.mouseMove, true);
    window.addEventListener('touchend', this.mouseUp, true);
  }

  /**
   * @func componentDidMount
   * @desc When the component has been mounted successfully, It retreives the post last 3 comments
   * and opens a channel for getting notified for new comments.
   * @memberof SeekBar
   * @override
   */
  public componentDidMount() {
    this.draggerElem.addEventListener('touchstart', this.mouseDown, true);
  }

  /**
   * @func componentWillUnmount
   * @desc Stops listening to the sync channels when the component is going to be destroyed
   * @memberof SeekBar
   * @override
   */
  public componentWillUnmount() {
    window.removeEventListener('touchstart', this.mouseMove);
    window.removeEventListener('touchend', this.mouseUp);
    this.draggerElem.removeEventListener('touchstart', this.mouseDown);
  }

  /**
   * @func componentWillReceiveProps
   * @memberof SeekBar
   * @override
   */
  public componentWillReceiveProps(props) {
    this.setState({
      panX: props.ratio * 100,
    });
  }

  private mouseDown = () => {
    this.setState({
      mouseDown: true,
    });
  }

  private mouseUp = () => {
    if (this.state.mouseDown) {
      this.setState({
        mouseDown: false,
      });
      this.props.onBarClick(this.state.panX);
    }
  }

  private mouseMove = (e) => {
    if (this.state.mouseDown) {
      const touch = e.touches[0];
      let range = touch.pageX - 86;
      const width = this.barElem.clientWidth;
      if (range < 0) {
        range = 0;
      }
      if (range > width) {
        range = width;
      }
      this.setState({
        panX: (range / width) * 100,
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
    this.barElem = value;
  }

  private draggerHandler = (value) => {
    this.draggerElem = value;
  }

  /**
   * @func render
   * @desc Renders the component
   * @returns
   * @memberof SeekBar
   * @generator
   */
  public render() {
    const draggerStyle = {
      left: this.state.panX + '%',
    };
    const playedBarStyle = {
      width: this.state.panX * 2 + '%',
    };
    return (
      <div className={style.playerHandler + ' ' + (this.state.mouseDown ? style.noTransition : '')}>
        <div className={style.bgBar} ref={this.refHandler}/>
        <div className={style.playedBar} style={playedBarStyle}/>
        <div className={style.playerDragger} ref={this.draggerHandler}
             style={draggerStyle}/>
      </div>
    );
  }
}

export default SeekBar;
