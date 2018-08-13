
import * as React from 'react';
import {Modal} from 'antd';
import {IcoN, PlaceItem} from 'components';
import PlaceApi from '../../api/place/';
import {IPlace} from 'api/interfaces';
import {differenceWith} from 'lodash';

const style = require('./remove-place.css');

interface IProps {
  places: IPlace[];
  onDone: (oldPlace, newPlace) => void;
  onClose: () => void;
}

interface IState {
    places: IPlace[];
    removePlces: IPlace[];
    priestine: boolean;
}

/**
 * Adds label to given array with suggesting user labels
 * @class AddLabel
 * @extends {React.Component<IProps, IState>}
 */
class RemovePlace extends React.Component<IProps, IState> {

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
      removePlces: [],
      priestine: true,
    };
    this.remove = this.remove.bind(this);
  }

  public componentDidMount() {
    this.PlaceApi = new PlaceApi();
    this.setState({
        places: this.props.places.filter((place: IPlace) => place.access.indexOf('D') > -1),
    });
  }

  private selectRemove = (event) => {
    if (!this.state.places.find((place) => place._id === event.target.value)) {
        return;
    }
    this.setState({
        removePlces: [
            ...this.state.removePlces,
            this.state.places.find((place) => place._id === event.target.value)],
    }, () => {
        this.removeSelectedsFromResults();
    });
  }

  private removeSelectedsFromResults() {
    this.setState({
      places: differenceWith(this.state.places, this.state.removePlces, (a, b) => {
        return a._id === b._id;
      }),
    });
  }

  private close = () => {
      if (!this.state.priestine) {
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

  private remove = (RPlace) => {
      const removePlces = this.state.removePlces;
      const i = removePlces.findIndex((place) => place._id === RPlace._id);
      if (i > -1) {
          removePlces.splice(i, 1);
      }
      this.setState({
        removePlces,
        places: [...this.state.places, RPlace],
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
                <h3>Remove a Place</h3>
                {this.state.removePlces.length > 0 && (
                    <div onClick={this.props.onDone.bind(this, this.state.removePlces)}>
                        <span>Save</span>
                    </div>
                )}
            </div>
            <label>Remove from:</label>
            <select onChange={this.selectRemove}>
                <option value="" selected={true}>Select a Place</option>
                {this.state.places.map((place) => <option value={place._id} key={place._id}>{place.name}</option>)}
            </select>
            <ul>
                {this.state.removePlces.map((place) => (
                    <li>
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
            </ul>
        </div>
      </div>
    );
  }
}

export {RemovePlace}
