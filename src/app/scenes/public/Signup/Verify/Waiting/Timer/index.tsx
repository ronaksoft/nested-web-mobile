/**
 * @file scenes/Signup/Veify/Waiting/Timer/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc A simple timer
 * @export {Timer}
 *
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-24
 * Reviewed by:            -
 * Date of review:         -
 *
 */
import * as React from 'react';

/**
 * @interface IProps
 * @desc A contarct for properties that Timer receives
 */
interface IProps {
  /**
   * @property time
   * @desc The time that Timer starts to count down
   * @type {number}
   * @memberof IProps
   */
  time: number;
  /**
   * @function onEnd
   * @desc A callback which will be called when the waiting time finishes
   * @memberof IProps
   */
  onEnd: () => void;
}

/**
 * @interface IState
 * @desc A contract for the component state
 */
interface IState {
  /**
   * @property left
   * @desc The time (seconds) left to zero. The value changes every second
   * @type {number}
   * @memberof IState
   */
  left: number;
}

/**
 * @class Timer
 * @desc A simple timer that starts counting down when the compnent mounts
 * and triggers a callback on finish
 * @extends {React.Component<IProps, IState>}
 */
class Timer extends React.Component<IProps, IState> {
  /**
   * @property interval
   * @desc A function that cancels the interval (stops counting down)
   * @private
   * @type {*}
   * @memberof Timer
   */
  private interval: any;
  constructor(props: IProps) {
    super();

    // sets a default value for the component state
    this.state = {
      left: props.time || 60,
    };
  }

  /**
   * @function getMinutes
   * @desc Calculates the left minutes and returns the value
   * @private
   * @memberof Timer
   * @returns {number}
   */
  private getMinutes = (): number => {
    return Math.floor(this.state.left / 60);
  }

  /**
   * @function getSeconds
   * @desc Calculates the left seconds and returns the value
   * @private
   * @memberof Timer
   * @returns {number}
   */
  private getSeconds = (): number => {
    return Math.floor(this.state.left % 60);
  }

  /**
   * @function componentDidMount
   * @desc Triggers the interval and counts down every 1 sec
   * @memberof Timer
   */
  public componentDidMount() {
    this.interval = setInterval(() => {
      if (this.state.left > 1) {
        this.setState({
          left: this.state.left - 1,
        });
      } else {
        clearInterval(this.interval);
        if (this.props.onEnd) {
          this.props.onEnd();
        }
      }
    }, 1000);
  }

  /**
   * @function componentWillUnmount
   * @desc Stops the interval when the component disappears
   * @memberof Timer
   */
  public componentWillUnmount() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  /**
   * @function render
   * @desc Renders the component
   * @memberof Timer
   */
  public render() {
    return (
      <span>{`${this.getMinutes()}:${this.getSeconds()}`}</span>
    );
  }
}

export default Timer;
