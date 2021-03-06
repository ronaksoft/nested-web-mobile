
import * as React from 'react';
import {Input, Modal} from 'antd';
import {IcoN} from 'components';
import LabelApi from '../../api/label/';
import ISearchLabelRequest from '../../api/label/interfaces/ISearchLabelRequest';
import {ILabel} from 'api/interfaces';
import CLabelFilterTypes from '../../api/label/consts/CLabelFilterTypes';
import {debounce, differenceWith, find, findIndex} from 'lodash';

const style = require('./labels.css');

interface IProps {
  labels: ILabel[];
  onDone: (labels) => void;
  onClose: () => void;
}

interface IState {
    labels: ILabel[];
    input: string;
    haveMore: boolean;
    searchResult: ILabel[];
    priestine: boolean;
}

/**
 * Adds label to given array with suggesting user labels
 * @class AddLabel
 * @extends {React.Component<IProps, IState>}
 */
class AddLabel extends React.Component<IProps, IState> {

    private LabelApi: LabelApi;
  /**
   * Creates an instance of AddLabel.
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
      labels: [],
      input: '',
      haveMore: true,
      searchResult: [],
      priestine: false,
    };
  }

  public componentDidMount() {
    this.LabelApi = new LabelApi();
    this.setState({
        labels: this.props.labels,
    });
    this.searchApi = debounce(this.searchApi, 256);
    this.searchApi();
  }

  private handleChangeInput = (e: any) => {
    this.setState({
        input: e.target.value,
    });
    this.searchApi();
  }

  private handleEnterInput = () => {
    console.log('');
  }

  private addLabel(label: ILabel) {
    if (find(this.state.labels, {_id: label._id})) {
      return;
    }
    this.setState({
        labels: [...this.state.labels, label],
        priestine: true,
    }, () => {
      this.trimReplicatedLabels();
    });
    this.searchApi();
  }

  private removeLabel(label: ILabel) {
    const index = findIndex(this.state.labels, {_id: label._id});
    const newLabels = this.state.labels.slice(0);
    newLabels.splice(index, 1);
    if (index > -1) {
      this.setState({
        labels: newLabels,
        priestine: true,
      }, () => {
        this.trimReplicatedLabels();
      });
      this.searchApi();
    }
  }

  private trimReplicatedLabels() {
    this.setState({
      searchResult: differenceWith(this.state.searchResult, this.state.labels, (a, b) => {
        return a._id === b._id;
      }),
    });
  }

  private closeAddLabel = () => {
      if (this.state.priestine) {
        Modal.confirm({
            title: 'Unsaved changes',
            content: 'are you sure for discarding changes here?',
            cancelText: 'Yes, Let me go',
            okText: 'No',
            onCancel: () => {
                this.props.onClose();
            },
        });
      } else {
        this.props.onClose();
      }
  }

  private searchApi = () => {
    const data: ISearchLabelRequest = {
        details: true,
        keyword: this.state.input,
        filter: CLabelFilterTypes.MY_LABELS,
        skip: 0,
        limit: 8,
    };
    this.LabelApi.search(data).then( (labels: ILabel[]) => {
        this.setState({
            searchResult: differenceWith(labels, this.state.labels, (a, b) => {
              return a._id === b._id;
            }),
        });
    });
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
                <div onClick={this.closeAddLabel}>
                    <IcoN size={24} name="xcross24"/>
                </div>
                <h3>Labels</h3>
                <div onClick={this.props.onDone.bind(this, this.state.labels)}>
                    <span>Done</span>
                </div>
            </div>
            <ul>
                {this.state.labels.map((label: ILabel, index: number) =>  (
                    <li key={label._id + index}>
                        <div className={style.icon}>
                            <IcoN size={16} name={'label16' + label.code}/>
                        </div>
                        <div className={style.detail}>
                            <span>
                                {label.title}
                            </span>
                            <div onClick={this.removeLabel.bind(this, label)}>
                                <IcoN size={16} name="xcross16Red"/>
                            </div>
                        </div>
                    </li>
                ))}
                <li className={style.input}>
                    <Input
                    placeholder={'Add new label???'}
                    value={this.state.input}
                    onChange={this.handleChangeInput}
                    onPressEnter={this.handleEnterInput}/>
                </li>
            </ul>
        </div>
        <ul className={style.suggests}>
            {this.state.searchResult.map((label: ILabel, index: number) =>  (
                <li key={label._id + index} onClick={this.addLabel.bind(this, label)}>
                    <div className={style.icon}>
                        <IcoN size={16} name={'label16' + label.code}/>
                    </div>
                    <div className={style.detail}>
                        <span>
                            {label.title}
                        </span>
                        <div>
                            <IcoN size={16} name="xcross16Green"/>
                        </div>
                    </div>
                </li>
            ))}
            {/* <li className={style.more}>
                <div className={style.icon}>
                    {!this.state.haveMore && <IcoN size={16} name="nonSearch"/>}
                </div>
                {this.state.haveMore && <span>Show more???</span>}
                {!this.state.haveMore && <span>No more results.</span>}
            </li> */}
        </ul>
      </div>
    );
  }
}

export {AddLabel}
