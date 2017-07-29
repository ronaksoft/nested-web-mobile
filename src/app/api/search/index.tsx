import Api from './../index';
import ISearchForComposeRequest from './interfaces/ISearchForComposeRequest';
import ISearchForComposeResponse from './interfaces/ISearchForComposeResponse';

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

};
