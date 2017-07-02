import * as React from 'react';
import _ from 'lodash';
import IPlace from '../../api/place/interfaces/IPlace';
import {Input} from 'antd';
import 'antd/dist/antd.css';

const style = require('./suggestion.css');

interface ISuggestProps {
  suggsts?: IPlace[];
}

interface ISuggestState {
  suggsts?: IPlace[];
}

class Suggestion extends React.Component<ISuggestProps, ISuggestState> {
  private debouncedFillSuggests: (val: string) => void;

  constructor(props: any) {
    super(props);
    this.debouncedFillSuggests = _.debounce(this.fillSuggests, 100);
  }

  private changeInputVal(event) {
    event.persist();
    const val = event.currentTarget.value;
    // console.log(val);
    this.debouncedFillSuggests(val);

  }

  private fillSuggests(query: string): Promise<any> {
    return Suggestion.getSuggests(query).then((items: IPlace[]) => {
      this.setState({
        suggsts: items,
      });
    });
  }

  private static getSuggests(query: string): Promise<any> {
    console.log(query);
    return new Promise((resolve) => {
      resolve(
        [
          {
            name: 'ALi',
            picture: 'http://xerxes.ronaksoftware.com:83/view/59588244ca36b70001efbcfd/THU592A9D036D433500013299F759' +
            '2A9D036D433500013299F8',
            id: 'ali',
          },
          {
            name: 'MAMAD',
            picture: 'http://xerxes.ronaksoftware.com:83/view/59588244ca36b70001efbcfd/THU592A9D036D433500013299F759' +
            '2A9D036D433500013299F8',
            id: 'mamad',
          },
        ],
      );
    });
  }

  // public componentWillMount() {
  // }

  public render() {
    return (
      <div className={style.suggestionWrpper}>
        <div className={style.input}>
          <span>
            With
          </span>
          <Input onChange={this.changeInputVal}/>
        </div>
        <ul className={style.suggests}>
          <li>
            aaa
          </li>
        </ul>
      </div>
    );
  }
}

export {Suggestion}
