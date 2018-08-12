
import * as React from 'react';
import {Input, Modal} from 'antd';
import {IcoN, PlaceItem} from 'components';
import PlaceApi from '../../api/place/';
import IAccountPlacesRequest from '../../api/place/interfaces/IAccountPlacesRequest';
import {IPlace} from 'api/interfaces';
import {debounce, differenceWith, find} from 'lodash';

const style = require('./move-place.css');

interface IProps {
  places: IPlace[];
  onDone: (oldPlace, newPlace) => void;
  onClose: () => void;
}

interface IState {
    places: IPlace[];
    fromPlace: IPlace;
    movePlace: IPlace;
    input: string;
    haveMore: boolean;
    searchResult: IPlace[];
    priestine: boolean;
}

/**
 * Adds label to given array with suggesting user labels
 * @class AddLabel
 * @extends {React.Component<IProps, IState>}
 */
class MovePlace extends React.Component<IProps, IState> {

  private PlaceApi: PlaceApi;
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
      places: [],
      fromPlace: null,
      movePlace: null,
      input: '',
      haveMore: true,
      searchResult: [],
      priestine: false,
    };
    this.remove = this.remove.bind(this);
  }

  public componentDidMount() {
    this.PlaceApi = new PlaceApi();
    this.setState({
        places: this.props.places.filter((place: IPlace) => place.access.indexOf('C') > -1),
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

  private selectFrom = (event) => {
    console.log(event);
    this.setState({
        fromPlace: event.target.value,
    });
  }

  private selectMove(place: IPlace) {
    if (find(this.props.places, {_id: place._id})) {
      return;
    }
    console.log(place);
    this.setState({
        movePlace: place,
        priestine: true,
    }, () => {
      this.removeSelectedsFromResults();
    });
    this.searchApi();
  }

  private removeSelectedsFromResults() {
    this.setState({
      searchResult: differenceWith(this.state.searchResult, this.state.places, (a, b) => {
        return a._id === b._id;
      }),
    });
  }

  private close = () => {
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
    const data: IAccountPlacesRequest = {
        with_children: true,
    };
    this.PlaceApi.getAllPlaces(data).then((places: IPlace[]) => {
        const result = places.filter((place) => place.access.indexOf('C') > -1);
        this.setState({
            searchResult: differenceWith(result, this.state.places, (a, b) => {
              return a._id === b._id;
            }),
        });
    });
  }

  private remove = () => {
      this.setState({
          movePlace: null,
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
                <div onClick={this.close}>
                    <IcoN size={24} name="xcross24"/>
                </div>
                <h3>Move a Place</h3>
                {this.state.movePlace && (
                    <div onClick={this.props.onDone.bind(this, this.state.fromPlace, this.state.movePlace._id)}>
                        <span>Save</span>
                    </div>
                )}
            </div>
            <label>Move from:</label>
            <select onChange={this.selectFrom}>
                <option value="" disabled={true} selected={true}>Select a Place</option>
                {this.state.places.map((place) => <option value={place._id} key={place._id}>{place.name}</option>)}
            </select>
            <label>Move to:</label>
            {!this.state.movePlace && (
                <div className={style.input}>
                    <Input
                        placeholder={'Place name'}
                        value={this.state.input}
                        onChange={this.handleChangeInput}
                        onPressEnter={this.handleEnterInput}/>
                </div>
            )}
            {this.state.movePlace && (
                <ul>
                    <li>
                        <div className={style.icon}>
                            <PlaceItem place_id={this.state.movePlace._id} size={24} borderRadius="3px"/>
                        </div>
                        <div className={style.detail}>
                            <span>
                                {this.state.movePlace.name}<br/>
                                <span>{this.state.movePlace._id}</span>
                            </span>
                            <div onClick={this.remove}>
                                <IcoN size={16} name="xcross16Red"/>
                            </div>
                        </div>
                    </li>
                </ul>
            )}
        </div>
        {!this.state.movePlace && (
            <ul className={style.suggests}>
                {this.state.searchResult.map((place: IPlace, index: number) =>  (
                    <li key={place._id + index} onClick={this.selectMove.bind(this, place)}>
                        <div className={style.icon}>
                            <PlaceItem place_id={place._id} size={24} borderRadius="3px"/>
                        </div>
                        <div className={style.detail}>
                            <span>
                                {place.name}<br/>
                                <span>{place._id}</span>
                            </span>
                            <div>
                                <IcoN size={16} name="xcross16Green"/>
                            </div>
                        </div>
                    </li>
                ))}
            </ul>
        )}
      </div>
    );
  }
}

export {MovePlace}
