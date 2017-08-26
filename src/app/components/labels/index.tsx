
import * as React from 'react';
import {Input} from 'antd';
import {IcoN} from 'components';

const style = require('./labels.css');

interface IProps {
  labels: any[];
  onDone: () => void;
}

interface IState {
    labels: any[];
    input: string;
    haveMore: boolean;
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
      input: '',
      haveMore: true,
    };
  }

  private handleChangeInput = (e: any) => {
    this.setState({
        input: e.target.value,
    });
  }

  private handleEnterInput = () => {
    console.log('');
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
        <div className={style.main}>
            <div className={style.AddLabelHead}>
                <div onClick={this.props.onDone}>
                    <IcoN size={24} name="xcross24"/>
                </div>
                <h3>Labels</h3>
            </div>
            <ul>
                {this.state.labels.map((label: any, index: number) =>  (
                    <li key={label._id + index}>
                        <div className={style.icon}>
                            <IcoN size={16} name={'label16' + label.code}/>
                        </div>
                        <div className={style.detail}>
                            <span>
                                {label.title}
                            </span>
                            <IcoN size={16} name="xcross16Red"/>
                        </div>
                    </li>
                ))}
                <li className={style.input}>
                    <Input
                    placeholder={'Add new label…'}
                    value={this.state.input}
                    onChange={this.handleChangeInput}
                    onPressEnter={this.handleEnterInput}/>
                </li>
            </ul>
        </div>
        <ul className={style.suggests}>
            {this.state.labels.map((label: any, index: number) =>  (
                <li key={label._id + index}>
                    <div className={style.icon}>
                        <IcoN size={16} name={'label16' + label.code}/>
                    </div>
                    <div className={style.detail}>
                        <span>
                            {label.title}
                        </span>
                        <IcoN size={16} name="xcross16Green"/>
                    </div>
                </li>
            ))}
            <li className={style.more}>
                <div className={style.icon}>
                    {!this.state.haveMore && <IcoN size={16} name="nonSearch"/>}
                </div>
                {this.state.haveMore && <span>Show more…</span>}
                {!this.state.haveMore && <span>No more results.</span>}
            </li>
        </ul>
      </div>
    );
  }
}

export {AddLabel}
