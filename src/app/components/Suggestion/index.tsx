/**
 * @file component/Suggestion/index.tsx
 * @author robzizo < me@robzizo.ir >
 * @description Represents the suggestion component for select item from suggests from api call.
 *              Documented by:          robzizo
 *              Date of documentation:  2017-07-23
 *              Reviewed by:            -
 *              Date of review:         -
 */
import * as React from 'react';
import {debounce} from 'lodash';
import {Input, Button, message} from 'antd';
import {PlaceChips} from 'components';
import {IChipsItem} from 'components/Chips';
import IPlace from 'api/place/interfaces/IPlace';
import SearchApi from 'api/search';
import FileUtil from 'services/utils/file';

const style = require('./suggestion.css');
const unknownPicture = require('assets/icons/absents_place.svg');

interface ISuggestProps {
  selectedItems?: IChipsItem[];
  onSelectedItemsChanged: (items: IChipsItem[]) => void;
}

interface ISuggestState {
  suggests?: IChipsItem[];
  selectedItems?: IChipsItem[];
  activeItem?: IChipsItem;
  input: string;
}

/**
 *
 * @class Suggestion
 * @classdesc get suggestions and handle selecting them and notify parent
 * @extends {React.Component<ISuggestProps, ISuggestState>}
 */
class Suggestion extends React.Component<ISuggestProps, ISuggestState> {

  /**
   * Define the `debouncedFillSuggests` to get suggestions appropriated to the query
   * @private
   */
  private debouncedFillSuggests: (val: string) => void;

  /**
   * Define the `searchApi`
   * @private
   */
  private searchApi: SearchApi;

  /**
   * @constructor
   * Creates an instance of Suggestion.
   * @param {ISuggestProps} props
   * @memberof Suggestion
   */
  constructor(props: any) {
    super(props);

    /**
     * Initial state object
     * @default
     * @type {object}
     * @property {array} suggests - list of suggested items from server
     * @property {array} selectedItems - selected items from suggests
     * @property {objecy} activeItem - a item is foussed and selected
     * @property {objecy} input - input value ( model )
     */
    this.state = {
      suggests: [],
      selectedItems: props.selectedItems || [],
      activeItem: null,
      input: null,
    };

    // assign debouncedFillSuggests
    this.debouncedFillSuggests = debounce(this.fillSuggests, 372); // Prevents the call stack and wasting resources

    // assign searchApi
    this.searchApi = new SearchApi();
  }

  public load(items: IChipsItem[]) {
    this.setState({
      selectedItems: items,
    });
  }

  /**
   * clears the suggested items array
   * @function clearSuggests
   * @memberof Suggestion
   */
  public clearSuggests = () => {
    this.setState({
      suggests: [],
    });
  }

  /**
   * this function calls after any change in component input and
   * call the `debouncedFillSuggests` to fill suggests list
   * @function handleInputChange
   * @private
   * @param {any} event
   * @memberof Suggestion
   */
  private handleInputChange(event) {
    this.setState({
      input: event.currentTarget.value,
    });
    this.debouncedFillSuggests(event.currentTarget.value);
  }

  /**
   * determine which key is pressed and make proper decesion
   * @example back space in empty input, remove last selected item
   * @function keyDownInputVal
   * @private
   * @param {any} event
   * @memberof Suggestion
   */
  private keyDownInputVal(event) {
    event.persist();
    /**
     * @const val - input value
     * @type string
     */
    const val = event.currentTarget.value;

    /**
     * removes the last selected item whenever the input is empty and
     * the backspace key is pressed.
     */
    if (event.key === 'Backspace' && val.length === 0) {
      const array = this.state.selectedItems;
      array.splice(this.state.selectedItems.length - 1, 1);
      this.setState({
        selectedItems: array,
      });
    }

    /**
     * adds first suggest to selected items on enter key press whenever the
     * input is filled
     */
    if (event.key === 'Enter' && val.length > 0) {
      const array = this.state.suggests;
      this.insertChip(array[0]);
    }

    if (event.keyCode === 32 || event.keyCode === 188) {
      event.preventDefault();

      const firstSuggestItem = this.state.suggests[0];

      if (firstSuggestItem && firstSuggestItem._id === this.state.input) {
        this.insertChip(this.state.suggests[0]);
      } else if (this.state.input && this.state.input.length > 3) {
        this.insertChip({
          _id: this.state.input,
          name: null,
          picture: null,
        });
      }
    }
  }

  /**
   * calls `getSuggests` function and set suggests items in component state
   * @private
   * @async
   * @param {string} query
   * @returns {Promise<any>}
   * @memberof Suggestion
   */
  private fillSuggests(query: string): Promise<any> {
    return this.getSuggests(query).then((items: IChipsItem[]) => {
      this.setState({
        suggests: items,
      });
    });
  }

  /**
   * get suggests items from api call
   * @private
   * @async
   * @param {string} query
   * @returns {Promise<any>}
   * @memberof Suggestion
   */
  private getSuggests(query: string): Promise<any> {
    return new Promise((resolve) => {
      this.searchApi.searchForCompose({
        keyword: query,
        limit: 13,
      }).then((response) => {

        let placesCount: number = 2;
        let recipientsCount: number = 1;

        const places: IPlace[] = response.places.filter((i) => {
          return this.state.selectedItems.findIndex((s) => s._id === i._id) === -1;
        });

        const recipients: string[] = response.recipients.filter((i) => {
          return this.state.selectedItems.findIndex((s) => s._id === i) === -1;
        });

        // we must have just 3 items to suggest
        // and the 3rd item should be a recipient
        if (recipients.length === 0) {
          recipientsCount = 0;
          placesCount = 3;
        }

        const items: IChipsItem[] = places.slice(0, placesCount).map((i) => {
          const item: IChipsItem = {
            _id: i._id,
            name: i.name,
            picture: i.picture,
          };

          return item;
        }).concat(recipients.slice(0, recipientsCount).map((i) => {
          const item: IChipsItem = {
            _id: i,
            name: null,
            picture: null,
          };

          return item;
        }));

        resolve(items);
      }, () => {
        message.error('Could not suggest any recipients right now');
      });
    });
  }

  /**
   * bold the search query in suggested item text
   * @private
   * @param {string} text
   * @param {string} keyword
   * @returns {string}
   * @memberof Suggestion
   */
  private mark = (text: string, keyword: string): string => {
    if (!keyword) {
      return text;
    }

    if (!text) {
      return text;
    }

    const index = text.toLowerCase().indexOf(keyword.toLowerCase());
    if (index === -1) {
      return text;
    }

    return text.replace(keyword, `<b>${keyword}</b>`);
  }

  /**
   * insert the chips to selected items and updates state also notifies parent
   * @private
   * @param {IChipsItem} item
   * @memberof Suggestion
   */
  private insertChip = (item: IChipsItem) => {
    /**
     * prevent to add multiple an item
     */
    if (this.state.selectedItems.findIndex((i) => i._id === item._id) > -1) {
      return;
    }

    const items = [...this.state.selectedItems, item];

    this.props.onSelectedItemsChanged(items);
    this.setState({
      selectedItems: items,
      input: null,
      suggests: [],
    });
  }

  /**
   * register handler for input focus in component
   * removes the active state of all chips and calls `fillSuggests`
   * @private
   * @memberof Suggestion
   */
  private handleInputFocus = () => {
    this.setState({
      activeItem: null,
    });
    this.fillSuggests(this.state.input);
  }

  /**
   * register handler for clicking on chips
   * set active state to chips and make other chipss diactive
   * @private
   * @memberof Suggestion
   */
  private handleChipsClick = (item: IChipsItem) => {
    this.setState({
      activeItem: item,
      suggests: [],
    });
  }

  /**
   * remove active item from selected items
   * @private
   * @memberof Suggestion
   */
  private removeItem = () => {
    const index = this.state.selectedItems.indexOf(this.state.activeItem);
    const items = [...this.state.selectedItems.slice(0, index), ...this.state.selectedItems.slice(index + 1)];
    this.props.onSelectedItemsChanged(items);
    this.setState({
      selectedItems: items,
      activeItem: null,
    });
  }

  /**
   * get picture of item
   * @returns {string}
   * @private
   * @memberof Suggestion
   */
  private getPicture = (item: IChipsItem) => {
    return item.picture && item.picture.x64
      ? FileUtil.getViewUrl(item.picture.x64)
      : unknownPicture;
  }

  /**
   * @function render
   * @description Renders the component
   * @returns {ReactElement} markup
   * @memberof Suggestion
   * @lends Suggestion
   */
  public render() {
    // tempFunctions for binding this and pass TSX hint

    /**
     * @const tempFunctionChange binds `this` to function
     * @type function
     */
    const tempFunctionChange = this.handleInputChange.bind(this);

    /**
     * @const tempFunctionKeydown binds `this` to function
     * @type function
     */
    const tempFunctionKeydown = this.keyDownInputVal.bind(this);

    /**
     * @const listItems - render Jsx elements of suggestions
     * @type Tsx element
     */
    const listItems = this.state.suggests.map((item) => {
      return (
        <li key={item._id}
            onClick={this.insertChip.bind(this, item)}>
          <img src={this.getPicture(item)} alt=""/>
          <div>
            {
              item.name && (
                <p dangerouslySetInnerHTML={{__html: this.mark(item.name, this.state.input)}}/>
              )
            }
            {
              item._id && (
                <span dangerouslySetInnerHTML={{__html: this.mark(item._id, this.state.input)}}/>
              )
            }
          </div>
        </li>
      );
    });

    /**
     * @const recipients - render Jsx elements of selected items
     * @type Tsx element
     */
    const recipients = this.state.selectedItems.map((item) => {
      return (
        <PlaceChips key={item._id} active={this.state.activeItem && item._id === this.state.activeItem._id}
                    onChipsClick={this.handleChipsClick} item={item}/>
      );
    });
    return (
      <div className={style.suggestionWrpper}>
        <div className={style.input}>
          <span>
            With:
          </span>
          {/* selected Items */}
          {recipients}
          <Input
            onChange={tempFunctionChange}
            onKeyDown={tempFunctionKeydown}
            onFocus={this.handleInputFocus}
            value={this.state.input}
          />
        </div>
        {/* suggestion Items */}
        {
          this.state.suggests.length > 0 &&
          (
            <ul className={style.suggests}>
              {listItems}
            </ul>
          )
        }
        {/* element for actions on active item */}
        {this.state.activeItem &&
        (
          <div className={style.selectItemControl}>
            <span>{this.state.activeItem._id}</span>
            <Button size="large" onClick={this.removeItem.bind(this, '')}>Remove</Button>
          </div>
        )}
      </div>
    );
  }
}

export {Suggestion}
