import Api from './../index';
import IPlaceSuggestComposeRequest from './interfaces/IPlaceSuggestComposeRequest';
import IAccountPlacesRequest from './interfaces/IAccountPlacesRequest';
import IGetUnreadsRequest from './interfaces/IGetUnreadsRequest';
import IGetRequest from './interfaces/IGetRequest';
import IPlace from './interfaces/IPlace';

export default class PlaceApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public placeSuggestCompose(placeSuggestRequest: IPlaceSuggestComposeRequest): Promise<any> {
    return this.api.request({
      cmd: 'search/places_for_compose',
      data: placeSuggestRequest,
    });
  }

  public getAllPlaces(getAllPlacesRequest: IAccountPlacesRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'account/get_all_places',
      data: getAllPlacesRequest,
    }).then( (res) => {
      const places = res.data.places as IPlace[];
      return places;
    });
  }

  public getUnreads(IGetUnreadsRequest: IGetUnreadsRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'place/count_unread_posts',
      data: IGetUnreadsRequest,
    }).then( (res) => {
      // const places = res.counts as IPlace[];
      return res.counts;
    });
  }

  public get(data: IGetRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/get',
      data,
    });
  }

  public getInvitations(): Promise<any> {
    return this.api.request({
      cmd: 'account/get_invitations',
    });
  }

};
