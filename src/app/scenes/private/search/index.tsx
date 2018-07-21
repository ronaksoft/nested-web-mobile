import * as React from 'react';
import SearchApi from 'api/search/index';
import AppApi from 'api/app/index';
import LabelApi from 'api/label/index';
import TimeUtiles from 'services/utils/time';
import {ISuggestion, IPost, ITask} from 'api/interfaces/';
import {IChipsItem} from 'components/Chips';
import {InfiniteScroll, Loading, IcoN, UserAvatar, FullName, PlaceItem, Suggestion} from 'components';
import * as _ from 'lodash';
import SearchService from 'services/search';
import CLabelFilterTypes from 'api/label/consts/CLabelFilterTypes';
import ISearchLabelRequest from 'api/label/interfaces/ISearchLabelRequest';
import {hashHistory} from 'react-router';
import {Input, Button} from 'antd';
import ISearchPostRequest from 'api/search/interfaces/ISearchPostRequest';
import ISearchTaskRequest from 'api/search/interfaces/ISearchTaskRequest';
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
  advancedDate: number;
  reachedTheEnd: boolean;
  advancedHasAttachment: boolean;
  advancedFrom: any[];
  advancedIn: any[];
  advancedTo: any[];
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
  private excludedQuery: string = '';
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
      reachedTheEnd: false,
      advancedKeyword: '',
      advancedFrom: [],
      advancedIn: [],
      advancedTo: [],
      advancedSubject: '',
      advancedDateIn: '',
      advancedDate: null,
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
      Object.keys(data).forEach((key) => {
        if (data[key]) {
          data[key] = data[key].concat([{}, {}, {}, {}]).slice(0, 4);
        }
      });
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

  public callSearchApi = () => {
    this.setState({
      loading: true,
    });
    const searchParams = this.searchService.getSearchParams();
    const keyword = searchParams.keywords.join(' ');
    if (this.isTask) {
      const params: ISearchTaskRequest = {
        assigner_id: searchParams.users.join(','),
        assignee_id: searchParams.tos.join(','),
        label_title: searchParams.labels.join(','),
        keyword: keyword === '_' ? '' : keyword,
        limit: 8,
        skip: 0,
      };
      if (this.state.isAdvanced) {
        params.has_attachment = searchParams.hasAttachment;
      }
      this.searchApi.searchTask(params).then((taskResults) => {
        this.setState({
          taskResults,
          reachedTheEnd: taskResults.length < 8,
          loading: false,
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
      this.searchApi.searchPost(params).then((postResults) => {
        this.setState({
          postResults,
          reachedTheEnd: postResults.length < 8,
          loading: false,
        });
      });
    }
  }

  private initSearch() {
    this.searchService.setQuery(this.state.params.query);
    this.initAdvancedSearch(this.searchService.getSearchParams());
    this.initChips(this.searchService.getSortedParams());
    this.suggestion = this.getUniqueItems(this.suggestion);
    if (this.suggestion) {
      this.setState({
        result: this.suggestion,
        isAdvanced: this.state.params.advanced === 'true',
      });
    } else {
      this.setState({
        isAdvanced: this.state.params.advanced === 'true',
      });
    }
    this.callSearchApi();
  }

  private loadMore = () => {
    const searchParams = this.searchService.getSearchParams();
    const keyword = searchParams.keywords.join(' ');
    if (this.isTask) {
      const params: ISearchTaskRequest = {
        assigner_id: searchParams.users.join(','),
        assignee_id: searchParams.tos.join(','),
        label_title: searchParams.labels.join(','),
        keyword: keyword === '_' ? '' : keyword,
        limit: 8,
        skip: this.state.taskResults.length,
      };
      if (this.state.isAdvanced) {
        params.has_attachment = searchParams.hasAttachment;
      }
      this.searchApi.searchTask(params).then((taskResults) => {
        this.setState({
          taskResults: [...this.state.taskResults, ...taskResults],
          reachedTheEnd: taskResults.length < 8,
          loading: false,
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
        skip: this.state.postResults.length,
      };
      if (this.state.isAdvanced) {
        params.subject = searchParams.subject;
        params.has_attachment = searchParams.hasAttachment;
        if (searchParams.before !== null && searchParams.after !== null) {
          params.before = searchParams.before;
          params.after = searchParams.after;
        }
      }
      this.searchApi.searchPost(params).then((postResults) => {
        this.setState({
          postResults: [...this.state.postResults, ...postResults],
          reachedTheEnd: postResults.length < 8,
          loading: false,
        });
      });
    }
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

  private initAdvancedSearch(params) {
    if (this.state.advancedIn.length === 0 && params.places && params.places.length > 0) {
      this.searchApi.getManyPlace(params.places.join(',')).then((places) => {
        this.setState({
          advancedIn: places,
        });
      });
    }

    if (this.state.advancedFrom.length === 0 && params.users && params.users.length > 0) {
      this.searchApi.getManyUser(params.users.join(',')).then((users) => {
        this.setState({
          advancedFrom: users,
        });
      });
    }

    if (this.state.advancedLabel.length === 0 && params.labels && params.labels.length > 0) {
      this.searchApi.getManyLabel(params.labels.join(',')).then((labels) => {
        this.setState({
          advancedLabel: labels,
        });
      });
    }

    if (this.state.advancedTo.length === 0 && params.tos && params.tos.length > 0) {
      this.searchApi.getManyUser(params.tos.join(',')).then((users) => {
        this.setState({
          advancedTo: users,
        });
      });
    }

    if (this.state.advancedSubject.length === 0 && params.subject && params.subject.length > 0) {
      this.setState({
        advancedSubject: params.subject,
      });
    }

    if (params.hasAttachment !== null) {
      this.setState({
        advancedHasAttachment: params.hasAttachment,
      });
    }

    if (this.searchService.getWithin() !== '' && this.searchService.getDate() !== '') {
      this.setState({
        advancedDateIn: this.searchService.getWithin(),
        advancedDate: parseInt(this.searchService.getDate(), 10),
      });
    }
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

  public addChip = (data: any, type) => {
    this.setState({
      showSuggest: false,
    });
    switch (type) {
      case 'account':
        this.searchService.addUser(data._id);
        this.setState({
          advancedFrom: [...this.state.advancedFrom, data],
        });
        break;
      case 'place':
        this.searchService.addPlace(data._id);
        this.setState({
          advancedIn: [...this.state.advancedIn, data],
        });
        break;
      case 'label':
        this.searchService.addLabel(data.title);
        this.setState({
          advancedLabel: [...this.state.advancedLabel, data],
        });
        break;
      case 'to':
        this.searchService.addTo(data._id);
        this.setState({
          advancedTo: [...this.state.advancedTo, data],
        });
        break;
      case 'app':
        this.searchService.setApp(data);
        break;
      default:
        break;
    }
    if (type === 'app') {
      // loadApp(id);
      console.log('load app');
    } else {
      this.searchIt();
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
    let index = -1;
    let advancedFrom = null;
    switch (type) {
      case prefix.place:
        this.searchService.removePlace(name);
        const advancedIn = this.state.advancedIn;
        index = _.findIndex(advancedIn, {_id: name});
        if (index > -1) {
          advancedIn.splice(index, 1);
          this.setState({
            advancedIn,
          });
        }
        break;
      case prefix.user:
        this.searchService.removeUser(name);
        advancedFrom = this.state.advancedFrom;
        index = _.findIndex(advancedFrom, {_id: name});
        if (index > -1) {
          advancedFrom.splice(index, 1);
          this.setState({
            advancedFrom,
          });
        }
        break;
      case prefix.label:
        this.searchService.removeLabel(name);
        const advancedLabel = this.state.advancedLabel;
        index = _.findIndex(advancedLabel, {title: name});
        if (index > -1) {
          advancedLabel.splice(index, 1);
          this.setState({
            advancedLabel,
          });
        }
        break;
      case prefix.to:
        this.searchService.removeTo(name);
        advancedFrom = this.state.advancedFrom;
        index = _.findIndex(advancedFrom, {_id: name});
        if (index > -1) {
          advancedFrom.splice(index, 1);
          this.setState({
            advancedFrom,
          });
        }
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
    this.searchIt();
  }

  private searchIt() {
    if (this.isTask) {
      hashHistory.push(`/task/search/${this.searchService.encode(
        this.state.isAdvanced ? this.searchService.toAdvancedString() : this.searchService.toString())
        }/${this.state.isAdvanced ? 'true' : 'false'}`);
    } else {
      hashHistory.push(`/search/${this.searchService.encode(
        this.state.isAdvanced ? this.searchService.toAdvancedString() : this.searchService.toString())
        }/${this.state.isAdvanced ? 'true' : 'false'}`);
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
      advancedKeyword: event.currentTarget.value,
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
  private referenceTo = (value: Suggestion) => {
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
  private handleToItemChanged = (advancedTo: IChipsItem[]) => {
    this.setState({
      advancedTo,
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
      input: event.currentTarget.value,
    });
  }
  private handleAdvancedDateInChange = (event) => {
    console.log(event.currentTarget.value);
    this.setState({
      advancedDateIn: event.currentTarget.value,
    });
  }
  private handleAdvancedDateChange = (event) => {
    console.log(event, event.currentTarget.value);
    this.setState({
      advancedDate: TimeUtiles.DateGet(event.currentTarget.value),
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
  private focusAdvancedKeyword = (/*event*/) => {
    // console.log(event.currentTarget.value);
    this.fromRef.clearSuggests();
    this.inRef.clearSuggests();
    this.labelRef.clearSuggests();
  }
  private submitAdvanced = (event) => {
    event.preventDefault();
    event.stopPropagation();
    this.searchService.reset();

    this.searchService.setUsers(this.state.advancedFrom);

    this.searchService.setPlaces(this.state.advancedIn);

    this.searchService.setTos(this.state.advancedTo);

    this.searchService.setLabels(this.state.advancedLabel);

    this.searchService.setAllKeywords(this.state.advancedKeyword);

    this.searchService.setWithin(this.state.advancedDateIn);

    this.searchService.setDate(this.state.advancedDate);

    this.searchService.setSubject(this.state.advancedSubject);

    this.searchService.setHasAttachment(this.state.advancedHasAttachment);

    this.initChips(this.searchService.getSortedParams());

    this.searchIt();
  }

  public render() {
    return (
      <div className={style.searchScrollbar} ref={this.refHandler}>
        <div className={style.searchWrp}>
          <InfiniteScroll
            scrollTopHandler={true}
            pullDownToRefresh={true}
            pullLoading={false}
            refreshFunction={this.callSearchApi}
            next={this.loadMore}
            route="search"
            hasMore={!this.state.reachedTheEnd && !this.state.showSuggest}
            loader={<Loading active={this.state.loading && !this.state.reachedTheEnd} position="fixed"/>}>
            <div style={{display: 'flex', flexDirection: 'column'}}>
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
                        <Suggestion ref={this.referenceTo}
                                    mode="user"
                                    placeholder="Assigned to:"
                                    editable={true}
                                    selectedItems={this.state.advancedTo}
                                    onSelectedItemsChanged={this.handleToItemChanged}
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
                          <option value="1">1 day</option>
                          <option value="7">1 week</option>
                          <option value="30">1 month</option>
                        </select>
                      </div>
                      <span>of</span>
                      <div className={style.searchBoxInner}>
                        <input value={this.state.advancedDate ? TimeUtiles.Date(this.state.advancedDate) : ''}
                              pattern="[0-9]{4}-[0-9]{2}-[0-9]{2}" type="date"
                              onChange={this.handleAdvancedDateChange} placeholder="Date"/>
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
              {!this.state.isAdvanced && this.state.input === '' &&
              this.defaultSuggestion && this.state.showSuggest && (
                <div className={style.options}>
                  {/*{this.defaultSuggestion.history && this.defaultSuggestion.history.length && (
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
                  )}*/}
                  {this.defaultSuggestion.accounts.length && (
                    <div className={style.block}>
                      <div className={style.head}>{this.isTask ? 'Tasks by' : 'Posts from'} :</div>
                      <ul>
                        {this.defaultSuggestion.accounts.map((account, index) => account._id ? (
                          <li onClick={this.addChip.bind(this, account, 'account')} key={account._id}>
                            <UserAvatar user_id={account} size={32} borderRadius={'16px'}/>
                            <FullName user_id={account}/>
                          </li>
                        ) : <li key={index}/>)}
                      </ul>
                    </div>
                  )}
                  {this.defaultSuggestion.places.length && (
                    <div className={style.block}>
                      <div className={style.head}>{this.isTask ? 'Assigned to' : 'Posts in'} :</div>
                      <ul>
                        {this.defaultSuggestion.places.map((place, index) => place._id ? (
                          <li onClick={this.addChip.bind(this, place, 'place')} key={place._id}>
                            <PlaceItem place_id={place._id} size={32} borderRadius="3px"/>
                            <span>{place.name}</span>
                          </li>
                        ) : <li key={index}/>)}
                      </ul>
                    </div>
                  )}
                  {this.defaultSuggestion.labels.length && (
                    <div className={style.block}>
                      <div className={style.head}>Has label:</div>
                      <ul>
                        {this.defaultSuggestion.labels.map((label, index) => label._id ? (
                          <li className={style[label.code]} onClick={this.addChip.bind(this, label, 'label')}
                              key={label._id}>
                            <IcoN size={24} name={'tag24'}/>
                            <span>{label.title}</span>
                          </li>
                        ) : <li key={index}/>)}
                      </ul>
                    </div>
                  )}
                </div>
              )}
              {!this.state.isAdvanced && this.state.input !== '' && this.state.showSuggest && (
                <div className={style.options}>
                  {this.state.result.accounts.length > 0 && (
                    <div className={style.block}>
                      <div className={style.head}>from:</div>
                      <ul className={style.column}>
                        {this.state.result.accounts.map((account) => (
                          <li onClick={this.addChip.bind(this, account, 'account')}>
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
                          <li onClick={this.addChip.bind(this, place, 'place')}>
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
                          <li className={style[label.code]} onClick={this.addChip.bind(this, label, 'label')}>
                            <IcoN size={24} name={'tag24'}/>
                            {label.title}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
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
                    <TaskUpcomingView task={task}/>
                  </div>
                );
              })}
              {!this.state.showSuggest && this.state.postResults.length === 0 && (
                <div className={privateStyle.emptyMessage}>No results found!!</div>
              )}
              <div className={privateStyle.bottomSpace}/>
            </div>
          </InfiniteScroll>
        </div>
      </div>
    );
  }
}

export default Search;
