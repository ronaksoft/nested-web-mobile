import Api from './../index';
import ISearchForComposeRequest from './interfaces/ISearchForComposeRequest';
import ISearchForComposeResponse from './interfaces/ISearchForComposeResponse';
import IUser from 'api/interfaces/IUser';
import ISuggestion from '../interfaces/ISuggestion';
import ISearchPostRequest from './interfaces/ISearchPostRequest';
import IPost from '../post/interfaces/IPost';
import ISearchTaskRequest from './interfaces/ISearchTaskRequest';
import ITask from '../task/interfaces/ITask';
import * as _ from 'lodash';
import ILabel from '../interfaces/ILabel';

export default class SearchApi {
  private api;

  /**
   * Creates an instance of SearchApi.
   * @memberof SearchApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func searchForCompose
   * @desc Suggests a list of reipients and places by the given keyword
   * @param {ISearchForComposeResponse} data
   * @returns {Promise<ISearchForComposeResponse>}
   * @memberof PlaceApi
   */
  public searchForCompose(data: ISearchForComposeRequest): Promise<ISearchForComposeResponse> {
    return this.api.request({
      cmd: 'search/places_for_compose',
      data,
    });
  }

  public searchForUsers(data: ISearchForComposeRequest): Promise<IUser[]> {
    return new Promise((res, rej) => {
      this.api.request({
        cmd: 'search/accounts_for_search',
        data,
      }).then((response) => {
        if (response.accounts && response.accounts.length > 0) {
          res(response.accounts);
        } else {
          this.api.request({
            cmd: 'search/accounts',
            data,
          }).then((result) => {
            res(result.accounts);
          }).catch(rej);
        }
      });
    });
  }

  public suggestion(keyword: string): Promise<ISuggestion> {
    const params = {
      keyword,
    };
    return this.api.request({
      cmd: 'search/suggestions',
      data: params,
    });
  }

  public searchPost(params: ISearchPostRequest): Promise<IPost[]> {
    return this.api.request({
      cmd: 'search/posts',
      data: params,
    }).then((res) => {
      return res.posts;
    });
  }

  public searchTask(params: ISearchTaskRequest): Promise<ITask[]> {
    return this.api.request({
      cmd: 'search/tasks',
      data: params,
    }).then((res) => {
      return res.tasks;
    });
  }

  public getManyUser(ids: string) {
    const data = {
      account_id: ids,
    };
    return this.api.request({
      cmd: 'account/get_many',
      data,
    }).then((res) => {
      return res.accounts;
    });
  }

  public getManyPlace(ids: string) {
    const data = {
      place_id: ids,
    };
    return this.api.request({
      cmd: 'place/get_many',
      data,
    }).then((res) => {
      return res.places;
    });
  }

  public getManyLabel(ids: string): Promise<ILabel[]> {
    return new Promise((resolve) => {
      const idArr = ids.split(',');
      const outArr = [];
      idArr.forEach((id) => {
        const data = {
          keyword: id,
          filter: 'all',
        };
        return this.api.request({
          cmd: 'search/labels',
          data,
        }).then((res) => {
          idArr.pop();
          const index = _.findIndex(res.labels, {title: id});
          if (index > -1) {
            outArr.push(res.labels[index]);
          }
          if (idArr.length === 0) {
            resolve(outArr);
          }
        });
      });
    });
  }

};
