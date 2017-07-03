import * as React from 'react';
import _ from 'lodash';
import IPlace from '../../api/place/interfaces/IPlace';
import { Input } from 'antd';
import 'antd/dist/antd.css';
const style = require('./suggestion.css');

interface ISuggestProps {
  suggsts?: Array<IPlace>;
}

interface ISuggestState {
  suggsts?: Array<IPlace>;
}

class Suggestion extends React.Component<ISuggestProps, ISuggestState> {

  constructor(props: any) {
    super(props);
  }

  private changeInputVal(event) {
    event.persist();
    const val = event.currentTarget.value;
    // console.log(val);
    this.debouncedFillSuggests(val);
    
  }
  
  private debouncedFillSuggests : _.debounce(this.fillSuggests, 100)
  
  private fillSuggests(query: String): Promise <any> {
    return this.getSuggests(query).then( function (items) {
      this.setState({
        suggests: items
      });
    })
  } 

  public getSuggests(query: String): Promise <any> {
    console.log(query);
    return new Promise((resolve) => {
      resolve(
        [{
          name : 'ALi',
          picture: 'http://xerxes.ronaksoftware.com:83/view/59588244ca36b70001efbcfd/THU592A9D036D433500013299F7592A9D036D433500013299F8',
          id: 'ali'
        },{
          name : 'MAMAD',
          picture: 'http://xerxes.ronaksoftware.com:83/view/59588244ca36b70001efbcfd/THU592A9D036D433500013299F7592A9D036D433500013299F8',
          id: 'mamad'
        }]
      );
    })
  }

  public componentWillMount () {}

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

export { Suggestion }
