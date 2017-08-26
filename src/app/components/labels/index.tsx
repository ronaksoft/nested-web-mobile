
import * as React from 'react';
import {IcoN} from 'components';

const style = require('./labels.css');

interface IProps {
  labels: any[];
  onDone: () => void;
}

interface IState {
    labels: any[];
}

/**
 * Adds label to given array with suggesting user labels
 * @class AddLabel
 * @extends {React.Component<IProps, IState>}
 */
class AddLabel extends React.Component<IProps, IState> {

  /**
   * Creates an instance of Invitation.
   * @constructor
   * @param {object} props
   * @memberof AddLabel
   */
  constructor(props: any) {
    super(props);

    /**
     * initial data set to prevent errors
     * @type {object}
     * @property {any} labels
     */
    this.state = {
      labels: [
          {
              _id: '01',
              code: 'B',
              title: 'aaaa',
          },
          {
              _id: '02',
              code: 'F',
              title: 'bbbb',
          },
      ],
    };
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof AddLabel
   * @lends AddLabel
   */
  public render() {
    return (
      <div className={style.AddLabel}>
        <div className={style.AddLabelHead}>
            <div onClick={this.props.onDone}>
                <IcoN size={24} name="xcross24"/>
            </div>
            <h3>Labels</h3>
        </div>
        <ul>
            {this.state.labels.map((label: any, index: number) =>  (
                <li>
                    <div className={style.icon}>
                        <IcoN size={24} name={'label16' + label.code}/>
                    </div>
                    <div className={style.detail}>
                        <span key={label._id + index}>
                            {label.title}
                        </span>
                        <IcoN size={24} name="xcross16Red"/>
                    </div>
                </li>
            ))}
        </ul>
      </div>
    );
  }
}

export {AddLabel}
