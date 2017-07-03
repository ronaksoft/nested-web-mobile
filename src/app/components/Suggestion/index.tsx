import * as React from 'react';
import { debounce } from 'lodash';
import IPlace from '../../api/place/interfaces/IPlace';
import {Input} from 'antd';
import 'antd/dist/antd.css';

const style = require('./suggestion.css');

interface ISuggestProps {
  suggests?: IPlace[];
}

interface ISuggestState {
  suggests?: IPlace[];
}

class Suggestion extends React.Component<ISuggestProps, ISuggestState> {
  private debouncedFillSuggests: (val: string) => void;

  constructor(props: any) {
    super(props);
    this.debouncedFillSuggests = debounce(this.fillSuggests, 100); // Prevents the call stack and wasting resources
  }
  // Calling on evry change in input
  private changeInputVal(event) {
    event.persist();
    const val = event.currentTarget.value;
    this.debouncedFillSuggests(val);
  }
  // fill and update suggest area
  private fillSuggests(query: string): Promise<any> {
    return Suggestion.getSuggests(query).then((items: IPlace[]) => {
      this.setState({
        suggests: items,
      });
    });
  }

  private static getSuggests(query: string): Promise<any> {
    return new Promise((resolve) => {
      // TODO get items from serve
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

  public componentWillMount() {
    this.setState({
      suggests: [],
    });
  }

  public render() {
    // tempFunction for binding this and holding TSX hint
    const tempFunction = this.changeInputVal.bind(this);
    const listItems = this.state.suggests.map((item) => {
      return (
        <li key={item._id}>
          <img src={item.picture.x32} alt=""/>
          <div>
            <p dangerouslySetInnerHTML={{ __html: item.name }}/>
            <span>{item._id}</span>
          </div>
        </li>
      );
    });
    return (
      <div className={style.suggestionWrpper}>
        <div className={style.input}>
          <span>
            With
          </span>
          <Input onChange={tempFunction}/>
        </div>
        <ul className={style.suggests}>
          {listItems}
        </ul>
      </div>
    );
  }
}

export {Suggestion}
