import Api from './../index';
import ISearchForComposeRequest from './interfaces/ISearchForComposeRequest';
import ISearchForComposeResponse from './interfaces/ISearchForComposeResponse';

export default class PlaceApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public searchForCompose(data: ISearchForComposeRequest): Promise<ISearchForComposeResponse> {
    return this.api.request({
      cmd: 'search/places_for_compose',
      data,
    });
  }

};
