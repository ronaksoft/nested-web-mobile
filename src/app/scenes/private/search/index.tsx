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
import ISearchPostRequest from '../../../api/search/interfaces/ISearchPostRequest';
import ISearchTaskRequest from '../../../api/search/interfaces/ISearchTaskRequest';

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
  params?: any;
  isAdvanced: boolean;
}

/**
 * @interface IProps
 */
interface IProps {
  thisApp: string;
  params?: any;
  location: any;
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
      params: props.params,
      isAdvanced: false,
    };
    this.searchApi = new SearchApi();
    this.labelApi = new LabelApi();
    this.appApi = new AppApi();
    this.searchService = new SearchService();
    this.debouncedSearch = _.debounce(this.search, 372);
  }

  public componentDidMount() {
    this.searchApi.suggestion('').then((data) => {
      this.defaultSuggestion = data;
      this.suggestion = _.cloneDeep(data);
    });
    this.initSearch();
  }

  public componentWillReceiveProps(newProps: IProps) {
    this.setState({
      thisApp: newProps.thisApp,
      params: newProps.params,
    }, () => {
      this.initSearch();
    });
  }

  private initSearch() {
    this.searchService.setQuery(this.state.params.query);
    this.initChips(this.searchService.getSortedParams());
    this.suggestion = this.getUniqueItems(this.suggestion);
    if (this.suggestion) {
      this.setState({
        result: this.suggestion,
      });
    }
    const searchParams = this.searchService.getSearchParams();
    const keyword = searchParams.keywords.join(' ');
    if (this.isTask) {
      const params: ISearchTaskRequest = {
        assigner_id: searchParams.users.join(','),
        assignee_id: searchParams.tos.join(','),
        label_title: searchParams.labels.join(','),
        keyword: keyword === '_' ? '' : keyword,
      };
      if (this.state.isAdvanced) {
        params.has_attachment = searchParams.hasAttachment;
      }
      this.searchApi.searchTask(params).then((result) => {
        console.log(result);
      });
    } else {
      const params: ISearchPostRequest = {
        advanced: true,
        place_id: searchParams.places.join(','),
        sender_id: searchParams.users.join(','),
        label_title: searchParams.labels.join(','),
        keyword: keyword === '_' ? '' : keyword,
        limit: 8,
        skip: 0,
      };
      if (this.state.isAdvanced) {
        params.subject = searchParams.subject;
        params.has_attachment = searchParams.hasAttachment;
        if (searchParams.before !== null && searchParams.after !== null) {
          params.before = searchParams.before;
          params.after = searchParams.after;
        }
      }
      this.searchApi.searchPost(params).then((result) => {
        console.log(result);
      });
    }
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
              this.suggestion = this.getUniqueItems({places: result.places});
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
              this.suggestion = this.getUniqueItems({accounts: result});
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
                this.suggestion = this.getUniqueItems({places: result.places});
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
              this.suggestion = this.getUniqueItems({tos: result});
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
              this.suggestion = this.getUniqueItems({labels: result});
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
              this.suggestion = this.getUniqueItems({apps: result});
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
              this.suggestion = this.getUniqueItems(result);
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

  private getUniqueItems(data) {
    if (!data) {
      return null;
    }
    const result = {
      places: [],
      accounts: [],
      labels: [],
      tos: [],
      apps: [],
      history: [],
    };
    const params = this.searchService.getSearchParams();
    if (!this.isTask) {
      if (data.places !== undefined) {
        result.places = _.differenceWith(data.places, params.places, (i1, i2) => {
          return i1._id === i2;
        });
      }
    }
    if (data.accounts !== undefined) {
      result.accounts = _.differenceWith(data.accounts, params.users, (i1, i2) => {
        return i1._id === i2;
      });
    }
    if (this.isTask) {
      if (data.tos !== undefined) {
        result.tos = _.differenceWith(data.tos, params.tos, (i1, i2) => {
          return i1._id === i2;
        });
      }
    }
    if (data.labels !== undefined) {
      result.labels = _.differenceWith(data.labels, params.labels, (i1, i2) => {
        return i1.title === i2;
      });
    }
    if (data.history !== undefined) {
      result.history = data.history;
    }
    return result;
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
    let keyword = '';
    params = _.filter(params, (item) => {
      if (item.type === 'keyword' && item.id !== '_') {
        keyword = item.id;
      }
      return (item.type !== 'keyword');
    });
    const chips = _.map(params, (item) => {
      return {
        type: types[item.type],
        title: item.id,
      };
    });
    // Resolve
    this.setState({
      chips,
      input: keyword,
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
        hashHistory.push(`/task/search/${this.searchService.encode(this.searchService.toString())}/false`);
      } else {
        hashHistory.push(`/search/${this.searchService.encode(this.searchService.toString())}/false`);
      }
      // vm.toggleSearchModal(false);
      this.queryType = 'other';
    }
  }

  private removeChip = (type, name) => {
    const prefix = this.searchService.getSearchPrefix();
    switch (type) {
      case prefix.place:
        this.searchService.removePlace(name);
        break;
      case prefix.user:
        this.searchService.removeUser(name);
        break;
      case prefix.label:
        this.searchService.removeLabel(name);
        break;
      case prefix.to:
        this.searchService.removeTo(name);
        break;
      case prefix.app:
        this.searchService.removeApp();
        // closeApp();
        return;
      case prefix.keyword:
      default:
        this.searchService.removeKeyword(name);
        break;
    }
    if (this.isTask) {
      hashHistory.push(`/task/search/${this.searchService.encode(this.searchService.toString())}/false`);
    } else {
      hashHistory.push(`/search/${this.searchService.encode(this.searchService.toString())}/false`);
    }
  }

  private refHandler = (value) => {
    this.notificationScrollbar = value;
  }

  private search(query: string) {
    this.getSuggestions(query).then((result) => {
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
                <div className={style.close} onClick={this.removeChip.bind(this, chip.type, chip.title)}>
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
                    <li onClick={this.addChip.bind(this, account._id, 'account')}>
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
