 import * as React from 'react';
// import PlaceApi from '../../api/place';
import { debounce } from 'lodash';
import {Input, Button, message} from 'antd';
import { PlaceChips } from 'components';
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

class Suggestion extends React.Component<ISuggestProps, ISuggestState> {
  private debouncedFillSuggests: (val: string) => void;
  private searchApi: SearchApi;

  constructor(props: any) {
    super(props);
    this.state = {
      suggests: [],
      selectedItems: props.selectedItems || [],
      activeItem: null,
      input: null,
    };
    this.debouncedFillSuggests = debounce(this.fillSuggests, 372); // Prevents the call stack and wasting resources
    this.searchApi = new SearchApi();
  }

  public load(items: IChipsItem[]) {
    this.setState({
      selectedItems: items,
    });
  }

  public clearSuggests = () => {
    this.setState({
      suggests: [],
    });
  }

  // Calling on evry change in input
  private handleInputChange(event) {
    this.setState({
      input: event.currentTarget.value,
    });
    this.debouncedFillSuggests(event.currentTarget.value);
  }
  // Calling on evry input key down
  private keyDownInputVal(event) {
    event.persist();
    const val = event.currentTarget.value;
    if (event.key === 'Backspace' && val.length === 0) {
      const array = this.state.selectedItems;
      array.splice(this.state.selectedItems.length - 1, 1);
      this.setState({
        selectedItems: array,
      });
    }
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
  // fill and update suggest area
  private fillSuggests(query: string): Promise<any> {
    return this.getSuggests(query).then((items: IChipsItem[]) => {
      this.setState({
        suggests: items,
      });
    });
  }

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

  private insertChip = (item: IChipsItem) => {
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

  private handleInputFocus = () => {
    this.setState({
      activeItem: null,
    });
    this.fillSuggests(this.state.input);
  }

  private handleChipsClick = (item: IChipsItem) => {
    this.setState({
      activeItem: item,
      suggests: [],
    });
  }

  private removeItem = () => {
    const index = this.state.selectedItems.indexOf(this.state.activeItem);
    const items = [...this.state.selectedItems.slice(0, index), ...this.state.selectedItems.slice(index + 1)];
    this.props.onSelectedItemsChanged(items);
    this.setState({
      selectedItems: items,
      activeItem: null,
    });
  }

  private getPicture = (item: IChipsItem) => {
    return item.picture && item.picture.x64
      ? FileUtil.getViewUrl(item.picture.x64)
      : unknownPicture;
  }

  public render() {
    // tempFunctions for binding this and pass TSX hint
    const tempFunctionChange = this.handleInputChange.bind(this);
    const tempFunctionKeydown = this.keyDownInputVal.bind(this);
    const listItems = this.state.suggests.map((item) => {
      return (
        <li key={item._id}
        onClick={this.insertChip.bind(this, item)}>
          <img src={this.getPicture(item)} alt=""/>
          <div>
            {
              item.name && (
                <p dangerouslySetInnerHTML={{ __html: this.mark(item.name, this.state.input) }}/>
              )
            }
            {
              item._id && (
                <span dangerouslySetInnerHTML={{ __html: this.mark(item._id, this.state.input) }} />
              )
            }
          </div>
        </li>
      );
    });
    const recipients = this.state.selectedItems.map((item) => {
      return (
        <PlaceChips key={item._id} active={this.state.activeItem && item._id === this.state.activeItem._id}
        onChipsClick={this.handleChipsClick} item={item} />
      );
    });
    return (
      <div className={style.suggestionWrpper}>
        <div className={style.input}>
          <span>
            With:
          </span>
          {recipients}
          <Input
                onChange={tempFunctionChange}
                onKeyDown={tempFunctionKeydown}
                onFocus={this.handleInputFocus}
                value={this.state.input}
          />
        </div>
        {
          this.state.suggests.length > 0 &&
          (
            <ul className={style.suggests}>
              {listItems}
            </ul>
          )
        }
        { this.state.activeItem &&
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
