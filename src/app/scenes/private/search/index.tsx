import * as React from 'react';
import SearchApi from 'api/search/index';
import AppApi from 'api/app/index';
import LabelApi from 'api/label/index';
import {ISuggestion} from 'api/interfaces/';
import {Scrollable, Loading, IcoN, UserAvatar, FullName} from 'components';
import * as _ from 'lodash';
import SearchService from 'services/search';
import CLabelFilterTypes from '../../../api/label/consts/CLabelFilterTypes';
import ISearchLabelRequest from '../../../api/label/interfaces/ISearchLabelRequest';
import {hashHistory} from 'react-router';
import {Input} from 'antd';

const style = require('./search.css');
const privateStyle = require('../private.css');

/**
 * @interface IState
 */
interface IState {
  loading: boolean;
  result: ISuggestion;
  thisApp: string;
  chips: any[];
  input: string;
  defaultSearch: boolean;
}

/**
 * @interface IProps
 */
interface IProps {
  thisApp: string;
  params?: any;
}

class Search extends React.Component<IProps, IState> {

  private notificationScrollbar: HTMLDivElement;
  private searchApi: SearchApi;
  private labelApi: LabelApi;
  private appApi: AppApi;
  private defaultSuggestion: ISuggestion;
  private suggestion: ISuggestion;
  private searchService: SearchService;
  private advancedSearch: any;
  private query: string = '';
  private newQuery: string = '';
  private selectedItem: number = -1;
  private excludedQuery: string = '';
  private queryType: string = '';
  private defaultSearch: boolean = true;
  private isTask: boolean = false;
  private debouncedSearch: (val: string) => void;

  constructor(props) {
    super(props);

    /**
     * @default
     * @type {object}
     * @property {string} notifications - notification items
     */
    this.state = {
      result: {
        history: [],
        places: [],
        accounts: [],
        labels: [],
        tos: [],
        apps: [],
      },
      defaultSearch: true,
      input: '',
      chips: [],
      loading: false,
      thisApp: props.thisApp,
    };
    this.searchApi = new SearchApi();
    this.labelApi = new LabelApi();
    this.appApi = new AppApi();
    this.searchService = new SearchService();
    this.debouncedSearch = _.debounce(this.search, 372);
  }

  public componentDidMount() {
    console.log('here');
    this.searchApi.suggestion('').then((data) => {
      this.defaultSuggestion = data;
      this.suggestion = _.cloneDeep(data);
    });
    this.initSearch();
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      thisApp: newProps.thisApp,
    });
    this.initSearch();
  }

  private initSearch() {
    this.searchService.setQuery(this.props.params.query);
    console.log(this.searchService.getSortedParams());
    this.initChips(this.searchService.getSortedParams());
  }

  public getAdvancedSearchParams() {
    this.advancedSearch.keywords = this.searchService.getAllKeywords();
    this.advancedSearch.users = this.searchService.getUsers();
    this.advancedSearch.places = this.searchService.getPlaces();
    this.advancedSearch.subject = this.searchService.getSubject();
    this.advancedSearch.labels = this.searchService.getLabels();
    this.advancedSearch.tos = this.searchService.getTos();
    this.advancedSearch.hasAttachment = this.searchService.getHasAttachment();
    this.advancedSearch.within = this.searchService.getWithin();
    if (this.advancedSearch.users.length > 0) {
      this.advancedSearch.users = this.advancedSearch.users + ', ';
    }
    if (this.advancedSearch.places.length > 0) {
      this.advancedSearch.places = this.advancedSearch.places + ', ';
    }
    if (this.advancedSearch.labels.length > 0) {
      this.advancedSearch.labels = this.advancedSearch.labels + ', ';
    }
    try {
      if (this.searchService.getDate() !== '') {
        this.advancedSearch.date = parseInt(this.searchService.getDate(), 10) / 1000;
      }
    } catch (e) {
      this.advancedSearch.date = '';
    }
  }

  public empty() {
    this.query = '';
    this.newQuery = '';
    this.advancedSearch = {
      keywords: '',
      users: '',
      places: '',
      subject: '',
      labels: '',
      tos: '',
      hasAttachment: false,
      within: '1',
      date: '',
    };
    this.selectedItem = -1;
    this.searchService.setQuery('');
    // getSuggestions(vm.newQuery);
  }

  public getSuggestions(query): Promise<any> {
    return new Promise((resolve, reject) => {
      if (_.trim(query).length === 0) {
        this.suggestion = _.cloneDeep(this.defaultSuggestion);
        resolve({
          suggestion: this.suggestion,
          default: true,
        });
      } else {
        this.defaultSearch = false;
        const result = SearchService.getLastItem(query);
        if (result.word === undefined || result.word === null) {
          result.word = '';
        }
        this.excludedQuery = result.word;
        this.queryType = result.type;
        let settings;
        switch (result.type) {
          // Place
          case 'place':
            this.searchApi.searchForCompose(result.word).then((result) => {
              this.suggestion = {places: result.places};
              // Resolve
              resolve({
                suggestion: this.suggestion,
                default: false,
              });
            }).catch((res) => {
              reject(res);
            });
            break;
          // User
          case 'user':
            settings = {
              query: result.word,
              limit: 6,
            };
            this.searchApi.searchForUsers(settings).then((result) => {
              this.suggestion = {accounts: result};
              // Resolve
              resolve({
                suggestion: this.suggestion,
                default: false,
              });
            }).catch((res) => {
              reject(res);
            });
            break;
          // To
          case 'to':
            // To for post
            if (!this.isTask) {
              this.searchApi.searchForCompose(result.word).then((result) => {
                this.suggestion = {places: result.places};
                // Resolve
                resolve({
                  suggestion: this.suggestion,
                  default: false,
                });
              }).catch((res) => {
                reject(res);
              });
              break;
            }
            // To for task
            settings = {
              query: result.word,
              limit: 6,
            };
            this.searchApi.searchForUsers(settings).then((result) => {
              this.suggestion = {tos: result};
              // Resolve
              resolve({
                suggestion: this.suggestion,
                default: false,
              });
            }).catch((res) => {
              reject(res);
            });
            break;
          // Label
          case 'label':
            const params: ISearchLabelRequest = {
              details: true,
              keyword: result.word,
              filter: CLabelFilterTypes.MY_LABELS,
              skip: 0,
              limit: 8,
            };
            this.labelApi.search(params).then((result) => {
              this.suggestion = {labels: result};
              // Resolve
              resolve({
                suggestion: this.suggestion,
                default: false,
              });
            }).catch((res) => {
              reject(res);
            });
            break;
          // App
          case 'app':
            this.appApi.search(result.word, 0, 10).then((result) => {
              this.suggestion = {apps: result};
              // Resolve
              resolve({
                suggestion: this.suggestion,
                default: false,
              });
            }).catch((res) => {
              reject(res);
            });
            break;
          // Default
          case 'other':
          default:
            this.searchApi.suggestion(result.word).then((result) => {
              this.suggestion = result;
              // Resolve
              resolve({
                suggestion: this.suggestion,
                default: false,
              });
            }).catch((res) => {
              reject(res);
            });
            break;
        }
      }
    });
  }

  public initChips(params) {
    const prefix = this.searchService.getSearchPrefix();
    const types = {
      place: prefix.place,
      user: prefix.user,
      label: prefix.label,
      to: prefix.to,
      app: prefix.app,
      keyword: prefix.keyword,
    };
    params = _.filter(params, (item) => {
      return (item.type !== 'keyword');
    });
    const chips = _.map(params, (item) => {
      return {
        type: types[item.type],
        title: item.id,
      };
    });
    this.setState({
      chips,
    });
  }

  public addChip = (id, type) => {
    switch (type) {
      case 'account':
        this.searchService.addUser(id);
        break;
      case 'place':
        this.searchService.addPlace(id);
        break;
      case 'label':
        this.searchService.addLabel(id);
        break;
      case 'to':
        this.searchService.addTo(id);
        break;
      case 'app':
        this.searchService.setApp(id);
        break;
      default:
        break;
    }
    if (type === 'app') {
      // loadApp(id);
      console.log('load app');
    } else {
      if (this.isTask) {
        hashHistory.push(`/search/${this.searchService.encode(this.searchService.toString())}/false`);
      } else {
        hashHistory.push(`/task/search/${this.searchService.encode(this.searchService.toString())}/false`);
      }
      // vm.toggleSearchModal(false);
      this.queryType = 'other';
    }
  }

  private refHandler = (value) => {
    this.notificationScrollbar = value;
  }

  private search(query: string) {
    this.getSuggestions(query).then((result) => {
      console.log(result);
      this.setState({
        result: result.suggestion,
      });
    });
  }

  private handleInputChange = (event) => {
    this.setState({
      input: event.currentTarget.value,
    }, () => {
      this.debouncedSearch(this.state.input);
    });
    // todo search
  }

  public render() {
    return (
      <div className={style.searchScrollbar} ref={this.refHandler}>
        <div className={style.searchBox}>
          <div className={style.searchBoxInner}>
            {this.state.chips.map((chip, index) => (
              <div className={style.queryChips} key={index}>
                {chip.type}:&nbsp;<b>{chip.title}</b>
                <div className={style.close}>
                  <IcoN name="xcross16White" size={16}/>
                </div>
              </div>
            ))}
            <Input
              onChange={this.handleInputChange}
              value={this.state.input}
              placeholder="Search everywhere..."
            />
          </div>
        </div>
        <div className={style.searchWrp}>
          <Scrollable active={true}>
            <div>
              <div className={style.block}>
                <div className={style.head}>Posts from:</div>
                <ul>
                  {this.state.result.accounts.map((account) => (
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
