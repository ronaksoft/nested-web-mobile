import Api from './../index';
import ISearchForComposeRequest from './interfaces/ISearchForComposeRequest';
import ISearchForComposeResponse from './interfaces/ISearchForComposeResponse';
import IUser from 'api/interfaces/IUser';

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
      }).then((data) => {
        if (data.accounts && data.accounts.length > 0) {
          res(data.accounts);
        } else {
          this.api.request({
            cmd: 'search/accounts',
            data,
          }).then((response) => {
            res(response.accounts);
          }).catch(rej);
        }
      });
    });
  }

};
