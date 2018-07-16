import * as React from 'react';
import SearchApi from '../../../api/search/index';
import {IUser} from 'api/interfaces/';
import {Scrollable, Loading, UserAvatar, FullName} from 'components';

const style = require('./search.css');
const privateStyle = require('../private.css');

/**
 *
 * @implements
 * @interface IState
 */
interface IState {
  loading: boolean;
  accounts: IUser[];
  histories: any[];
  places: any[];
  labels: any[];
  apps: any[];
  tos: any[];
  thisApp: string;
}

/**
 *
 * @implements
 * @interface IProps
 */
interface IProps {
  thisApp: string;
}

class Search extends React.Component<IProps, IState> {

  private notificationScrollbar: HTMLDivElement;
  private searchApi: SearchApi;

  constructor(props) {
    super(props);

    /**
     * @default
     * @type {object}
     * @property {string} notifications - notification items
     */
    this.state = {
      histories: [],
      places: [],
      accounts: [],
      labels: [],
      tos: [],
      apps: [],
      loading: false,
      thisApp: props.thisApp,
    };
    this.searchApi = new SearchApi();
  }

  public componentDidMount() {
    
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      thisApp: newProps.thisApp,
    });
  }

  private refHandler = (value) => {
    this.notificationScrollbar = value;
  }

  public render() {
    return (
      <div className={style.searchScrollbar} ref={this.refHandler}>
        <div className={style.searchBox}>
          <input type="text" placeholder="Search everywhere..."/>
        </div>
        <div className={style.searchWrp}>
          <Scrollable active={true}>
            <div>
              <div className={style.block}>
                <div className={style.head}>Posts from:</div>
                <ul>
                  {this.state.accounts.map((account) => (
                    <li>
                      <UserAvatar user_id={account} size={32} borderRadius={'16px'}/>
                      <FullName user_id={account}/>
                    </li>
                  ))}
                </ul>
              </div>
              <Loading active={this.state.loading} position="fixed"/>
              <div className={privateStyle.bottomSpace}/>
            </div>
          </Scrollable>
        </div>
      </div>
    );
  }
}

export default Search;
