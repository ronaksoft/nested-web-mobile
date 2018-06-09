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
// import {findIndex} from 'lodash/array';
import {Input, Button, message} from 'antd';
import {PlaceChips, UserChips} from 'components';
import {LabelChips} from 'components/Chips/label';
import {IChipsItem} from 'components/Chips';
import {IPlace} from 'api/interfaces';
import SystemApi from 'api/system/';
import SearchApi from 'api/search';
import LabelApi from 'api/label';
import FileUtil from 'services/utils/file';
import CONFIG from '../../config';

const style = require('./suggestion.css');
const unknownPicture = require('assets/icons/absents_place.svg');

interface ISuggestProps {
  selectedItems?: any[];
  onSelectedItemsChanged: (items: any[]) => void;
  mode?: string;
  placeholder?: string;
  editable?: boolean;
}

interface ISuggestState {
  suggests?: any[];
  selectedItems?: any[];
  activeItem?: IChipsItem;
  input: string;
  placeholder?: string;
  editable?: boolean;
}

/**
 *
 * @class Suggestion
 * @classdesc get suggestions and handle selecting them and notify parent
 * @extends {React.Component<ISuggestProps, ISuggestState>}
 */
class Suggestion extends React.Component<ISuggestProps, ISuggestState> {

  /**
   * @prop systemConstApi
   * @desc An instance of base Api
   * @private
   * @memberof Suggestion
   */
  private systemConstApi;
  private mode: string = 'place';

  private targetLimit: number;

  /**
   * Define the `searchApi`
   * @private
   */
  private searchApi: SearchApi;
  private LabelApi: LabelApi;

  /**
   * Define the `debouncedFillSuggests` to get suggestions appropriated to the query
   * @private
   */
  private debouncedFillSuggestsCompose: (val: string) => void;
  private debouncedFillSuggestsUsers: (val: string) => void;

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
      placeholder: props.placeholder,
      activeItem: null,
      input: null,
      editable: props.editable === false ? false : true,
    };

    if (props.mode) {
      this.mode = props.mode;
    }
    // assign debouncedFillSuggests
    // Prevents the call stack and wasting resources
    this.debouncedFillSuggestsCompose = debounce(this.fillComposeSuggests, 372);
    this.debouncedFillSuggestsUsers = debounce(this.fillUserSuggests, 372);

    // assign searchApi
    this.LabelApi = new LabelApi();
    this.searchApi = new SearchApi();
    this.systemConstApi = new SystemApi();
  }

  public load(items: IChipsItem[]) {
    this.setState({
      selectedItems: items,
    });
  }

  public componentWillReceiveProps(nProps) {
    this.setState({
      editable: nProps.editable,
      placeholder: nProps.placeholder,
    });
  }

  public componentWillMount() {
    if (this.mode === 'place') {
      this.initPlace();
    }
  }

  private initPlace = () => {
    this.systemConstApi.get().then((result) => {
      this.targetLimit = result.post_max_targets || 10;
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
    if (this.mode === 'place') {
      this.debouncedFillSuggestsCompose(event.currentTarget.value);
    } else {
      this.debouncedFillSuggestsUsers(event.currentTarget.value);
    }
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
      this.props.onSelectedItemsChanged(array);
    }

    /**
     * adds first suggest to selected items on enter key press whenever the
     * input is filled
     */
    if ((event.key === 'Enter' || event.keyCode === 13) && val.length > 0) {
      const array = this.state.suggests;
      if (CONFIG().REGEX.EMAIL.test(val)) {
        array.push({
          _id: val,
          name: val,
        });
      }
      this.insertChip(array[0]);
    }

    if (event.keyCode === 32 || event.keyCode === 188) {
      event.preventDefault();

      const firstSuggestItem = this.state.suggests[0];

      if (firstSuggestItem && firstSuggestItem._id === this.state.input) {
        this.insertChip(this.state.suggests[0]);
      } else if (this.state.input && this.state.input.length > 1) {
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
  private fillComposeSuggests(query: string): Promise<any> {
    query = query || '';
    return this.getComposeSuggests(query).then((items: IChipsItem[]) => {
      if (query.length > 0) {
        // const index = findIndex(items, {_id: query});
        const index = items.findIndex((s) => s._id === query);
        let item: IChipsItem;
        if (index === -1) {
          item = {
            _id: query,
            name: query,
          };
          if (items.length > 1) {
            items.splice(4, 0, item);
          } else {
            items.push(item);
          }
        }
      }
      this.setState({
        suggests: items,
      });
    });
  }
  private fillUserSuggests(query: string): Promise<any> {
    query = query || '';
    return this.getUserSuggests(query).then((items: IChipsItem[]) => {
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
  private getComposeSuggests(query: string): Promise<any> {
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
  private getUserSuggests(query: string): Promise<any> {
    return new Promise((resolve) => {
      const apiResponse = (result) => {
        const users = result.filter((i) => {
          return this.state.selectedItems.findIndex((s) => s._id === i._id) === -1;
        });
        const items = users.slice(0, 3);
        resolve(items);
      };

      const apiError = () => {
        message.error('Could not suggest any user right now');
      };
      if (this.mode === 'user') {
        this.searchApi.searchForUsers({
          keyword: query,
          limit: 3,
        }).then(apiResponse, apiError);
      } else {
        this.LabelApi.search({
          skip: 0,
          limit: 3,
          filter: 'all',
          keyword: query,
          details: true,
        }).then(apiResponse, apiError);
      }
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
    // prevent exceed maximum compose recipients.
    // TODO notify user
    if (this.state.selectedItems.length === this.targetLimit) {
      return;
    }
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
    if (this.mode === 'place') {
      this.fillComposeSuggests(this.state.input);
    } else if (this.mode === 'label') {
      this.fillUserSuggests(this.state.input);
    } else {
      this.fillUserSuggests(this.state.input);
    }
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
      let name = item.name || item.title || item.fullName || item._id;
      if (item.fname) {
        name = item.fname + ' ' + item.lname;
      }
      return (
        <li key={item._id}
            onClick={this.insertChip.bind(this, item)}>
          <img src={this.getPicture(item)} alt=""/>
          <div>
            <p dangerouslySetInnerHTML={{__html: this.mark(name, this.state.input)}}/>
          </div>
        </li>
      );
    });
    let recipients;

    /**
     * @const recipients - render Jsx elements of selected items
     * @type Tsx element
     */
    switch (this.mode) {
      default:
      case 'place':
        recipients = this.state.selectedItems.map((item) => {
          return (
            <PlaceChips key={item._id} active={this.state.activeItem && item._id === this.state.activeItem._id}
                        onChipsClick={this.handleChipsClick} item={item}/>
          );
        });
      break;

      case 'user':
        recipients = this.state.selectedItems.map((item) => {
          return (
            <UserChips key={item._id} active={this.state.activeItem && item._id === this.state.activeItem._id}
                        onChipsClick={this.handleChipsClick} user={item} editable={this.state.editable}/>
          );
        });
      break;

      case 'label':
        recipients = this.state.selectedItems.map((item) => {
          return (
            <LabelChips key={item._id} active={this.state.activeItem && item._id === this.state.activeItem._id}
                        onChipsClick={this.handleChipsClick} label={item} editable={this.state.editable}/>
          );
        });
      break;
    }
    console.log(recipients, this.state.selectedItems);
    return (
      <div className={style.suggestionWrpper}>
        <div className={style.input}>
          {this.mode === 'place' && (
            <span>
              With:
            </span>
          )}
          {/* selected Items */}
          {recipients}
          {this.state.editable && (
            <Input
              onChange={tempFunctionChange}
              onKeyDown={tempFunctionKeydown}
              onFocus={this.handleInputFocus}
              value={this.state.input}
              placeholder={this.props.placeholder}
            />
          )}
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
