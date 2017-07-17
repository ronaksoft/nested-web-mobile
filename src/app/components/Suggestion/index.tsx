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
  private inputVal: string;
  private searchApi: SearchApi;

  constructor(props: any) {
    super(props);
    this.debouncedFillSuggests = debounce(this.fillSuggests, 100); // Prevents the call stack and wasting resources
    this.searchApi = new SearchApi();
  }

  public componentWillMount() {
    this.setState({
      suggests: [],
      selectedItems: this.props.selectedItems || [],
      activeItem: null,
    });
  }

  // public componentDidMount() {
  // }

  public componentWillReceiveProps(nextProps) {
    console.log(nextProps);
    this.unSelectItem();
  }
  // Calling on evry change in input
  private changeInputVal(event) {
    event.persist();
    const val = event.currentTarget.value;
    this.inputVal = val;
    console.log(this.inputVal);
    this.debouncedFillSuggests(val);
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
      const items = [];
      this.searchApi.searchForCompose({
        keyword: query,
        limit: 3,
      }).then((response) => {
        items.push.apply(items, response.places);
        items.push.apply(items, response.recipients);

        const itemsMap = items.map( (item) => {
          // FIXME : Case sensetive issue
          if (item.name.indexOf(query) > -1) {
            item.name = item.name.replace(query, '<b>' + query + '</b>');
          }

          return item;
        });
        // TODO : Remove expression on release just : query.length
        resolve( query.length > 0 ? itemsMap : []);
      }, (error) => {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
      });
    });
  }

  private insertChip = (item: IChipsItem) => {
    item.name = item.name.replace('<b>', '');
    item.name = item.name.replace('</b>', '');
    const items = [...this.state.selectedItems, item];
    this.props.onSelectedItemsChanged(items);
    this.setState({
      selectedItems: items,
    });
  }

  private unSelectItem = () => {
    this.setState({
      activeItem: null,
    });
  }

  private handleChipsClick = (item: IChipsItem) => {
    this.setState({
      activeItem: item,
      suggests: [],
    });
  }

  private removeItem = () => {
    const index = this.state.selectedItems.indexOf(this.state.activeItem);
    this.unSelectItem();
    const items = [...this.state.selectedItems.slice(0, index), ...this.state.selectedItems.slice(index + 1)];
    this.props.onSelectedItemsChanged(items);
    this.setState({
      selectedItems: items,
    });
  }

  private getPicture = (item: IChipsItem) => {
    return item.picture.x64 ? FileUtil.getViewUrl(item.picture.x64) : unknownPicture;
  }

  public render() {
    // tempFunctions for binding this and pass TSX hint
    const tempFunctionChange = this.changeInputVal.bind(this);
    const tempFunctionFocus = this.unSelectItem.bind(this);
    const tempFunctionKeydown = this.keyDownInputVal.bind(this);
    const listItems = this.state.suggests.map((item) => {
      return (
        <li key={item._id}
        onClick={this.insertChip.bind(this, item)}>
          <img src={this.getPicture(item)} alt=""/>
          <div>
            <p dangerouslySetInnerHTML={{ __html: item.name }}/>
            <span>{item._id}</span>
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
          <Input onChange={tempFunctionChange} onKeyDown={tempFunctionKeydown}
          onFocus={tempFunctionFocus}/>
        </div>
        <ul className={style.suggests}>
          {listItems}
        </ul>
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
