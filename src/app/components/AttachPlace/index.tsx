
import * as React from 'react';
import {Input, Modal} from 'antd';
import {IcoN, PlaceItem} from 'components';
import SearchApi from '../../api/search/';
import ISearchForComposeRequest from '../../api/search/interfaces/ISearchForComposeRequest';
import {IPlace} from 'api/interfaces';
import {debounce, differenceWith, find, findIndex} from 'lodash';

const style = require('./attach-place.css');

interface IProps {
  places: IPlace[];
  onDone: (labels) => void;
  onClose: () => void;
}

interface IState {
    places: IPlace[];
    newPlaces: IPlace[];
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
class AttachPlace extends React.Component<IProps, IState> {

  private SearchApi: SearchApi;
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
      newPlaces: [],
      input: '',
      haveMore: true,
      searchResult: [],
      priestine: false,
    };
  }

  public componentDidMount() {
    this.SearchApi = new SearchApi();
    this.setState({
        places: this.props.places,
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

  private add(place: IPlace) {
    if (find(this.state.places, {_id: place._id})) {
      return;
    }
    this.setState({
        newPlaces: [...this.state.newPlaces, place],
        priestine: true,
    }, () => {
      this.removeSelectedsFromResults();
    });
  }

  private remove(place: IPlace) {
    const index = findIndex(this.state.places, {_id: place._id});
    const newPlaces = this.state.places.slice(0);
    newPlaces.splice(index, 1);
    if (index > -1) {
      this.setState({
        newPlaces,
        priestine: true,
      }, () => {
          this.searchApi();
      });
    }
  }

  private removeSelectedsFromResults() {
    this.setState({
      searchResult: differenceWith(this.state.searchResult, this.state.places.concat(this.state.newPlaces), (a, b) => {
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
    const data: ISearchForComposeRequest = {
        keyword: this.state.input,
        limit: 8,
    };
    this.SearchApi.searchForCompose(data).then( (response: any) => {
        const result = response.places.concat(response.recipients.map((email) => {
            return {
                _id: email,
                name: email,
            };
        }));
        this.setState({
            searchResult: differenceWith(result, this.state.places, (a, b) => {
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
                <div onClick={this.close}>
                    <IcoN size={24} name="xcross24"/>
                </div>
                <h3>Attach a Place</h3>
                <div onClick={this.props.onDone.bind(this, this.state.newPlaces)}>
                    <span>Save</span>
                </div>
            </div>
            <ul>
                {this.state.places.map((place: IPlace, index: number) =>  (
                    <li key={place._id + index}>
                        <div className={style.icon}>
                            <PlaceItem place_id={place._id} size={24} borderRadius="3px"/>
                        </div>
                        <div className={style.detail}>
                            <span>
                                {place.name}<br/>
                                <span>{place._id}</span>
                            </span>
                            <div>
                                <IcoN size={16} name="lock16"/>
                            </div>
                        </div>
                    </li>
                ))}
                {this.state.newPlaces.map((place: IPlace, index: number) =>  (
                    <li key={place._id + index}>
                        <div className={style.icon}>
                            <PlaceItem place_id={place._id} size={24} borderRadius="3px"/>
                        </div>
                        <div className={style.detail}>
                            <span>
                                {place.name}<br/>
                                <span>{place._id}</span>
                            </span>
                            <div onClick={this.remove.bind(this, place)}>
                                <IcoN size={16} name="xcross16Red"/>
                            </div>
                        </div>
                    </li>
                ))}
                <li className={style.input}>
                    <Input
                    placeholder={'Place name'}
                    value={this.state.input}
                    onChange={this.handleChangeInput}
                    onPressEnter={this.handleEnterInput}/>
                </li>
            </ul>
        </div>
        <ul className={style.suggests}>
            {this.state.searchResult.map((place: IPlace, index: number) =>  (
                <li key={place._id + index} onClick={this.add.bind(this, place)}>
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
      </div>
    );
  }
}

export {AttachPlace}
