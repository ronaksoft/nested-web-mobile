/**
 * @file component/NewBadge/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the NewBadge component. Component gets the
 *              requiered data from its parent.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-22
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';

const style = require('./newbadge.css');

interface IProps {
  text: string;
  onClick: () => void;
  visibility: boolean;
  count: number;
}

interface IState {
  text: string;
  onClick: () => void;
  visibility: boolean;
  count: number;
}

/**
 * This class renders an fixed element at bottom of window that shows new push is recieved
 * @class NewBadge
 * @extends {React.Component<IProps, IState>}
 */
class NewBadge extends React.Component<IProps, IState> {

  /** constructor
   * Creates an instance of NewBadge.
   * @param {object} props
   * @memberof NewBadge
   */
  constructor(props: any) {
    super(props);

    /**
     * read the data from props and set to the state
     * @type {object}
     * @property {string} text the text for echo in badge
     * @property {function} onClick badge function reference
     * @property {boolean} visibility render condition
     * @property {number} count the count of new recieved activities
     */
    this.state = {
      text: this.props.text,
      onClick: this.props.onClick,
      visibility: this.props.visibility,
      count: this.props.count,
    };
  }

  /**
   * props data maybe changes during the run time and need to update state
   * @param {IProps} newProps
   * @memberof NewBadge
   */
  public componentWillReceiveProps(newProps: IProps) {

    this.setState({
      text: newProps.text,
      onClick: newProps.onClick,
      visibility: newProps.visibility,
      count: newProps.count,
    });
  }

  /**
   * renders the component
   * @returns {ReactElement} markup
   * @memberof NewBadge
   */
  public render() {
    return (
      <div>
        { this.state.visibility && (
          <div className={style.badge} onClick={this.state.onClick}>
            <span>{this.state.text}</span>
            <div className={style.count}>{this.state.count}</div>
          </div>
        )}
      </div>
    );
  }
}

export {NewBadge}
