import * as React from 'react';
import PlaceApi from '../../api/place';
import { debounce } from 'lodash';
import IPlace from '../../api/place/interfaces/IPlace';
import {Input, Button} from 'antd';
import { PlaceChips } from 'components';
import 'antd/dist/antd.css';

const style = require('./suggestion.css');

interface ISuggestProps {
  selectedItems?: IPlace[];
  activeItem: number;
}

interface ISuggestState {
  suggests?: IPlace[];
  selectedItems?: IPlace[];
  activeItem?: IPlace;
  input: string;
}

class Suggestion extends React.Component<ISuggestProps, ISuggestState> {
  private debouncedFillSuggests: (val: string) => void;
  private placeApi: any;

  constructor(props: any) {
    super(props);
    this.debouncedFillSuggests = debounce(this.fillSuggests, 100); // Prevents the call stack and wasting resources
    this.placeApi = new PlaceApi();
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
    this.debouncedFillSuggests(val);
  }
  // Calling on evry input key down
  private keyDownInputVal(event) {
    event.persist();
    const val = event.currentTarget.value;
    console.log(this.state.input);
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
    return this.getSuggests(query).then((items: IPlace[]) => {
      this.setState({
        suggests: items,
      });
    });
  }

  private getSuggests(query: string): Promise<any> {
    return new Promise((resolve) => {
      // TODO get items from serve
      this.placeApi.placeSuggestCompose({
        keyword: query,
        limit: 2,
      }).then((items) => {
        console.log(items);
      });
      const items = [
        {
          name: 'ALi',
          picture: 'http://xerxes.ronaksoftware.com:83/view/59588244ca36b70001efbcfd/' +
          'THU592A9D036D433500013299F759' +
          '2A9D036D433500013299F8',
          _id: 'ali',
        },
        {
          name: 'MAMAD',
          picture: {
            x32 : 'http://xerxes.ronaksoftware.com:83/view/59588244ca36b70001efbcfd/' +
          'THU592A9D036D433500013299F759' +
          '2A9D036D433500013299F8',
          },
          _id: 'mamad',
        },
      ];
      // Bold the query in item name
      const itemsMap = items.map( (item) => {
        // FIXME : Case sensetive issue
        if (item.name.indexOf(query) > -1) {
          item.name = item.name.replace(query, '<b>' + query + '</b>');
        }
        return item;
      });
      // TODO : Remove expression on release just : query.length
      resolve( query.length > 0 ? itemsMap : []);
    });
  }

  private insertChip = (item: IPlace) => {
    item.name = item.name.replace('<b>', '');
    item.name = item.name.replace('</b>', '');
    this.setState({
      selectedItems: [...this.state.selectedItems, item],
    });
  }

  private unSelectItem = () => {
    this.setState({
      activeItem: null,
    });
  }

  private handleChipsClick = (item: IPlace) => {
    this.setState({
      activeItem: item,
    });
  }

  private removeItem = () => {
    const index = this.state.selectedItems.indexOf(this.state.activeItem);
    this.unSelectItem();
    this.setState({
      selectedItems: [...this.state.selectedItems.slice(0, index), ...this.state.selectedItems.slice(index + 1)],
    });
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
          <img src={item.picture.x32} alt=""/>
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
          onFocus={tempFunctionFocus} value={this.state.input}/>
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
