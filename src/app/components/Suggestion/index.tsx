 import * as React from 'react';
// import PlaceApi from '../../api/place';
import { debounce } from 'lodash';
import {Input, Button} from 'antd';
import { PlaceChips } from 'components';
import {IChipsItem} from 'components/Chips';
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
    this.debouncedFillSuggests = debounce(this.fillSuggests, 372); // Prevents the call stack and wasting resources
    this.searchApi = new SearchApi();
  }

  public componentWillMount() {
    this.setState({
      suggests: [],
      selectedItems: this.props.selectedItems || [],
      activeItem: null,
    });
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
        let placesCount: number = response.places.length < 3 ? response.places.length : 3;
        const recipientsCount: number = response.recipients.length < 3 ? response.recipients.length : 3;

        // we must have just 3 items to suggest
        // and the 3rd item should be a recipient
        if (recipientsCount > 0) {
          placesCount = 2;
        }

        const items: IChipsItem[] = response.places.filter((i) => {
          return this.state.selectedItems.findIndex((s) => s._id === i._id) === -1;
        }).map((i) => {
          const item: IChipsItem = {
            _id: i._id,
            name: i.name,
            picture: i.picture,
          };

          return item;
        }).slice(0, placesCount).concat(response.recipients.filter((i) => {
          return this.state.selectedItems.findIndex((s) => s._id === i._id) === -1;
        }).map((i) => {
          const item: IChipsItem = {
            _id: i._id,
            name: `${i.fname} ${i.lname}`,
            picture: i.picture,
          };

          return item;
        }).slice(0, recipientsCount));

        resolve(items);
      }, (error) => {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
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
    const items = [...this.state.selectedItems, item];

    this.props.onSelectedItemsChanged(items);
    this.setState({
      selectedItems: items,
      input: null,
    });
    this.fillSuggests(this.state.input);
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
    return item.picture.x64
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
            <p dangerouslySetInnerHTML={{ __html: this.mark(item.name, this.state.input) }}/>
            <span dangerouslySetInnerHTML={{ __html: this.mark(item._id, this.state.input) }} />
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
