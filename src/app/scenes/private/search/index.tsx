import * as React from 'react';
import SearchApi from 'api/search/index';
import AppApi from 'api/app/index';
import LabelApi from 'api/label/index';
import {ISuggestion, IPost, ITask} from 'api/interfaces/';
import {IChipsItem} from 'components/Chips';
import {Scrollable, Loading, IcoN, UserAvatar, FullName, PlaceItem, Suggestion} from 'components';
import * as _ from 'lodash';
import SearchService from 'services/search';
import CLabelFilterTypes from '../../../api/label/consts/CLabelFilterTypes';
import ISearchLabelRequest from '../../../api/label/interfaces/ISearchLabelRequest';
import {hashHistory} from 'react-router';
import {Input, Button} from 'antd';
import ISearchPostRequest from '../../../api/search/interfaces/ISearchPostRequest';
import ISearchTaskRequest from '../../../api/search/interfaces/ISearchTaskRequest';
import Post from '../posts/components/post/index';
import TaskUpcomingView from '../tasks/components/list/upcomingItem/index';

const style = require('./search.css');
const privateStyle = require('../private.css');

/**
 * @interface IState
 */
interface IState {
  loading: boolean;
  result: ISuggestion;
  chips: any[];
  postResults: any[];
  taskResults: any[];
  input: string;
  showSuggest: boolean;
  defaultSearch: boolean;
  params?: any;
  isAdvanced: boolean;
  advancedKeyword: string;
  advancedSubject: string;
  advancedDateIn: string;
  advancedDate: string;
  advancedHasAttachment: boolean;
  advancedFrom: any[];
  advancedIn: any[];
  advancedLabel: any[];
}

/**
 * @interface IProps
 */
interface IProps {
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
      showSuggest: true,
      input: '',
      chips: [],
      postResults: [],
      taskResults: [],
      loading: false,
      params: props.params,
      isAdvanced: false,
      advancedHasAttachment: false,
      advancedKeyword: '',
      advancedFrom: [],
      advancedIn: [],
      advancedSubject: '',
      advancedDateIn: '',
      advancedDate: '',
      advancedLabel: [],
    };
    this.searchApi = new SearchApi();
    this.labelApi = new LabelApi();
    this.appApi = new AppApi();
    this.searchService = new SearchService();
    this.debouncedSearch = _.debounce(this.search, 372);
  }

  public componentDidMount() {
    this.isTask = this.props.location.pathname.substr(0, 5) === '/task';
    this.searchApi.suggestion('').then((data) => {
      this.defaultSuggestion = data;
      this.suggestion = _.cloneDeep(data);
      this.forceUpdate();
    });
    this.initSearch();
  }

  public componentWillReceiveProps(newProps: IProps) {
    // this.isTask = newProps.thisApp === 'TasksSearch';
    this.setState({
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
      console.log(params);
      this.searchApi.searchTask(params).then((taskResults) => {
        this.setState({
          taskResults,
        });
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
      console.log(params);
      this.searchApi.searchPost(params).then((postResults) => {
        this.setState({
          postResults,
        });
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
      showSuggest: chips.length === 0,
      input: keyword,
    });
  }

  public addChip = (id, type) => {
    this.setState({
      showSuggest: false,
    });
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

  private gotoPost(post: IPost) {
    hashHistory.push(`/message/${post._id}`);
  }

  private gotoTask(task: ITask) {
    hashHistory.push(`/task/edit/${task._id}`);
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
  }

  private focusInput = () => {
    this.setState({
      showSuggest: true,
    });
  }

  private toggleAdvancedSearch = () => {
    this.setState({
      isAdvanced: !this.state.isAdvanced,
    });
  }

  private keyDownInput = (event) => {
    if (event.key === 'Backspace' && this.state.input.length === 0) {
      const item = this.state.chips[this.state.chips.length - 1];
      this.removeChip.bind(this, item.type, item.title);
    }

    if ((event.key === 'Escape' || event.key === 'Enter' || event.keyCode === 13 || event.keyCode === 27)) {
      this.setState({
        showSuggest: false,
      });
    }
  }

  // Advanced Search related methods
  private fromRef;
  private inRef;
  private labelRef;
  private referenceFrom = (value: Suggestion) => {
    this.fromRef = value;
  }
  private referenceIn = (value: Suggestion) => {
    this.inRef = value;
  }
  private referenceLabel = (value: Suggestion) => {
    this.labelRef = value;
  }
  private handleFromItemChanged = (advancedFrom: IChipsItem[]) => {
    this.setState({
      advancedFrom,
    });
  }
  private handleInItemChanged = (advancedIn: IChipsItem[]) => {
    this.setState({
      advancedIn,
    });
  }
  private handleLabelItemChanged = (advancedLabel: IChipsItem[]) => {
    this.setState({
      advancedLabel,
    });
  }
  private handleAdvancedKeywordChange = (event) => {
    this.setState({
      advancedKeyword: event.currentTarget.value,
    });
  }
  private handleAdvancedDateInChange = (event) => {
    this.setState({
      advancedDateIn: event.currentTarget.value,
    });
  }
  private handleAdvancedDateChange = (event) => {
    this.setState({
      advancedDate: event.currentTarget.value,
    });
  }
  private handleAdvancedSubjectChange = (event) => {
    this.setState({
      advancedSubject: event.currentTarget.value,
    });
  }
  private handleAdvancedHasAttachment = (event) => {
    this.setState({
      advancedHasAttachment: event.currentTarget.checked,
    });
  }
  private focusAdvancedKeyword = (event) => {
    console.log(event.currentTarget.value);
    this.fromRef.clearSuggests();
    this.inRef.clearSuggests();
    this.labelRef.clearSuggests();
  }
  private submitAdvanced = (event) => {
    event.preventDefault();
    event.stopPropagation();
    console.log(event.nativeEvent);
  }

  public render() {
    return (
      <div className={style.searchScrollbar} ref={this.refHandler}>
        <div className={style.searchBox}>
          {!this.state.isAdvanced && (
            <div className={style.searchBoxInner}>
              {this.state.chips.map((chip, index) => (
                <div className={style.queryChips} key={index}>
                  {chip.type}&nbsp;<b>{chip.title}</b>
                  <div className={style.close} onClick={this.removeChip.bind(this, chip.type, chip.title)}>
                    <IcoN name="xcross16White" size={16}/>
                  </div>
                </div>
              ))}
              <Input
                onChange={this.handleInputChange}
                value={this.state.input}
                onFocus={this.focusInput}
                onKeyDown={this.keyDownInput}
                placeholder="Search everywhere..."
              />
            </div>
          )}
          {this.state.isAdvanced && (
            <form className={style.advancedSearch} onSubmit={this.submitAdvanced}>
              <div className={style.searchBoxInner}>
                <Input
                  onFocus={this.focusAdvancedKeyword}
                  onChange={this.handleAdvancedKeywordChange}
                  value={this.state.advancedKeyword}
                  placeholder="Keyword"
                />
              </div>
              <div className={style.searchBoxInner}>
                <Suggestion ref={this.referenceFrom}
                  mode="user"
                  placeholder="from:"
                  editable={true}
                  selectedItems={this.state.advancedFrom}
                  onSelectedItemsChanged={this.handleFromItemChanged}
                  />
              </div>
              <div className={style.searchBoxInner}>
                {this.isTask && (
                  <Suggestion ref={this.referenceIn}
                    mode="user"
                    placeholder="Assigned to:"
                    editable={true}
                    selectedItems={this.state.advancedIn}
                    onSelectedItemsChanged={this.handleInItemChanged}
                    />
                )}
                {!this.isTask && (
                  <Suggestion ref={this.referenceIn}
                    mode="place"
                    placeholder="in:"
                    editable={true}
                    selectedItems={this.state.advancedIn}
                    onSelectedItemsChanged={this.handleInItemChanged}
                    />
                )}
              </div>
              <div className={style.searchBoxInner}>
                <Input
                  onChange={this.handleAdvancedSubjectChange}
                  value={this.state.advancedSubject}
                  onFocus={this.focusInput}
                  placeholder="Subject"
                />
              </div>
              <div className={style.searchBoxInner}>
                <Suggestion ref={this.referenceLabel}
                  mode="label"
                  editable={true}
                  placeholder="Add labels..."
                  selectedItems={this.state.advancedLabel}
                  onSelectedItemsChanged={this.handleLabelItemChanged}
                  />
              </div>
              <div className={style.rowInput}>
                <div className={style.searchBoxInner}>
                  <select value={this.state.advancedDateIn} onChange={this.handleAdvancedDateInChange}>
                    <option>1 weeks</option>
                    <option>2 weeks</option>
                    <option>3 weeks</option>
                  </select>
                </div>
                <span>of</span>
                <div className={style.searchBoxInner}>
                  <input type="date" placeholder="Date" value={this.state.advancedDate}
                    onChange={this.handleAdvancedDateChange}/>
                </div>
              </div>
              <div className={style.attachmentOption}>
                <label htmlFor="contains-attachment">
                  <IcoN size={16} name={'attach16'}/>
                  only results that have attachment
                </label>
                <input type="checkbox" id="contains-attachment" checked={this.state.advancedHasAttachment}
                  onChange={this.handleAdvancedHasAttachment}/>
              </div>
              <div className={style.searchSubmit}>
                <Button type="primary" htmlType="submit">Search</Button>
              </div>
            </form>
          )}
          {!this.state.isAdvanced && <a onClick={this.toggleAdvancedSearch}>More options...</a>}
          {this.state.isAdvanced && <a onClick={this.toggleAdvancedSearch}>Less options...</a>}
        </div>
        <div className={style.searchWrp}>
          <Scrollable active={true}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
              {!this.state.isAdvanced && this.state.input === '' &&
                this.defaultSuggestion && this.state.showSuggest && (
                <div className={style.options}>
                  {this.defaultSuggestion.history && this.defaultSuggestion.history.length && (
                    <div className={style.block}>
                      <div className={style.head}>Latest:</div>
                      <ul>
                        {this.defaultSuggestion.history.slice(0, 4).map((history) => (
                          <li onClick={this.addChip.bind(this, history, 'his')}>
                            {history}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {this.defaultSuggestion.accounts.length && (
                    <div className={style.block}>
                      <div className={style.head}>{this.isTask ? 'Tasks by' : 'Posts from'} :</div>
                      <ul>
                        {this.defaultSuggestion.accounts.slice(0, 4).map((account) => (
                          <li onClick={this.addChip.bind(this, account._id, 'account')}>
                            <UserAvatar user_id={account} size={32} borderRadius={'16px'}/>
                            <FullName user_id={account}/>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {this.defaultSuggestion.places.length && (
                    <div className={style.block}>
                      <div className={style.head}>{this.isTask ? 'Assigned to' : 'Posts in'} :</div>
                      <ul>
                        {this.defaultSuggestion.places.slice(0, 4).map((place) => (
                          <li onClick={this.addChip.bind(this, place._id, 'place')}>
                            <PlaceItem place_id={place._id} size={32} borderRadius="3px"/>
                            <span>{place.name}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {this.defaultSuggestion.labels.length && (
                    <div className={style.block}>
                      <div className={style.head}>Has label:</div>
                      <ul>
                        {this.defaultSuggestion.labels.slice(0, 4).map((label) => (
                          <li className={style[label.code]} onClick={this.addChip.bind(this, label.title, 'label')}>
                            <IcoN size={24} name={'tag24'}/>
                            <span>{label.title}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className={privateStyle.bottomSpace}/>
                </div>
              )}
              {this.state.input !== '' && this.state.showSuggest  && (
                <div className={style.options}>
                  {this.state.result.accounts.length > 0 && (
                    <div className={style.block}>
                      <div className={style.head}>from:</div>
                      <ul className={style.column}>
                        {this.state.result.accounts.map((account) => (
                          <li onClick={this.addChip.bind(this, account._id, 'account')}>
                            <UserAvatar user_id={account} size={24} borderRadius={'16px'}/>
                            <FullName user_id={account}/>
                            <small>{account._id}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {this.state.result.places.length > 0 && (
                    <div className={style.block}>
                      <div className={style.head}>to:</div>
                      <ul className={style.column}>
                        {this.state.result.places.map((place) => (
                          <li onClick={this.addChip.bind(this, place._id, 'place')}>
                            <PlaceItem place_id={place._id} size={24} borderRadius="3px"/>
                            <span>{place.name}</span>
                            <small>{place._id}</small>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {this.state.result.labels.length > 0 && (
                    <div className={style.block}>
                      <div className={style.head}>Has label:</div>
                      <ul className={style.column}>
                        {this.state.result.labels.map((label) => (
                          <li className={style[label.code]} onClick={this.addChip.bind(this, label.title, 'label')}>
                            <IcoN size={24} name={'tag24'}/>
                            {label.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div className={privateStyle.bottomSpace}/>
                </div>
              )}
              {!this.state.showSuggest && !this.isTask && this.state.postResults.map((post) => {
                return (
                  <div className={style.post} key={post._id} id={post._id} onClick={this.gotoPost.bind(this, post)}>
                    <Post post={post}/>
                  </div>
                );
              })}
              {!this.state.showSuggest && this.isTask && this.state.taskResults.map((task) => {
                return (
                  <div key={task._id} onClick={this.gotoTask.bind(this, task)}>
                    <TaskUpcomingView task={task} />
                  </div>
                );
              })}
              {!this.state.showSuggest && this.state.postResults.length === 0 && (
                <div className={privateStyle.emptyMessage}>No results found!!</div>
              )}
              <Loading active={this.state.loading} position="fixed"/>
            </div>
          </Scrollable>
        </div>
      </div>
    );
  }
}

export default Search;
