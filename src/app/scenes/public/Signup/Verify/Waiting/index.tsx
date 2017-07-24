/**
 * @file scenes/Signup/Veify/Waiting/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Adds a timer and a custom message in front of the component inner child
 * and counts down from the given time to zero
 * @export {Waiting}
 * Documented by:          Soroush Torkzadeh
 * Date of documentation:  2017-07-24
 * Reviewed by:            -
 * Date of review:         -
 *
 */

import * as React from 'react';
import Timer from './Timer';

/**
 * @interface IProps
 * @desc A contract for the component properties
 */
interface IProps {
  /**
   * @property time
   * @desc The time that the user have to wait
   * @type {number}
   * @memberof IProps
   */
  time: number;
  /**
   * @property trigger
   * @desc A flag that we observe its value to start waiting for the given time
   * @type {boolean}
   * @memberof IProps
   */
  trigger: boolean;
  /**
   * @property onFinish
   * @desc A callback that will be triggered when the waiting time finishes
   * @memberof IProps
   */
  onFinish: () => void;
  /**
   * @property message
   * @desc A message that will be placed next to the message
   * @type {string}
   * @memberof IProps
   */
  message?: string;
}

/**
 * @desc A contract for the component state
 * @interface IState
 */
interface IState {
  /**
   * @property running
   * @desc A flag that represents Timer is counting down or not
   * @type {boolean}
   * @memberof IState
   */
  running: boolean;
  /**
   * @property timeLeft
   * @desc The remaining time
   * @type {number}
   * @memberof IState
   */
  timeLeft: number;
}

/**
 * @class Waiting
 * @desc A component that wraps everything and displays a timer counting down
 * When the time reaches the end, a callback will be triggered
 * @extends {React.Component<IProps, IState>}
 */
class Waiting extends React.Component<IProps, IState> {

  /**
   * Creates an instance of Waiting.
   * @param {IProps} props
   * @memberof Waiting
   */
  constructor(props: IProps) {
    super();

    // Sets the component state default value
    this.state = {
      running: false,
      timeLeft: props.time,
    };
  }

  /**
   * @function handleEnd
   * @desc Updates running state and triggers onFinish property when Timer stops
   * @private
   * @memberof Waiting
   */
  private handleEnd = () => {
    this.setState({
      running: false,
    });
    if (this.props.onFinish) {
      this.props.onFinish();
    }
  }

  /**
   * @function componentWillReceiveProps
   * @desc Updates running state on receiving new props
   * @param {any} nextProps
   * @memberof Waiting
   */
  public componentWillReceiveProps(nextProps) {
    if (nextProps.trigger) {
      this.setState({
        running: true,
      });
    }
  }

  /**
   * @function render
   * @desc Renders the component interface
   * @returns
   * @memberof Waiting
   */
  public render() {
    return (
      <div>
        {/* Here will be rendered what the component wraps */}
        {this.props.children}
        {this.state.running &&
          (
            <span>
              <span>{this.props.message}</span>
              <Timer time={this.props.time} onEnd={this.handleEnd} />
            </span>
          )
        }
      </div>
    );
  }
}

export default Waiting;
