/**
 * @file api/place/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc All APIs are related to Place
 * @export PlaceApi
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-27
 * Reviewed by:           -
 * Date of review:        -
 */
import Api from './../index';
import IPlaceSuggestComposeRequest from './interfaces/IPlaceSuggestComposeRequest';
import IAccountPlacesRequest from './interfaces/IAccountPlacesRequest';
import IGetUnreadsRequest from './interfaces/IGetUnreadsRequest';
import IGetUnreadsResponse from './interfaces/IGetUnreadsResponse';
import IGetRequest from './interfaces/IGetRequest';
import IPlace from './interfaces/IPlace';

export default class PlaceApi {
  /**
   * @desc An instance of Api
   * @prop api
   * @private
   * @memberof PlaceApi
   */
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

  /**
   * @func getAllPlaces
   * @desc Get all places that the authenticated user is a member
   * @param {IAccountPlacesRequest} getAllPlacesRequest 
   * @returns {Promise<any>} 
   * @memberof PlaceApi
   */
  public getAllPlaces(getAllPlacesRequest: IAccountPlacesRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'account/get_all_places',
      data: getAllPlacesRequest,
    }).then( (res) => {
      const places = res.data.places as IPlace[];
      return places;
    });
  }

  /**
   * @func getUnreads
   * @desc Retrieves the place unread posts count. If you want to get the number of
   * unread posts in the place and all children, set `subs` to true
   * @param {IGetUnreadsRequest} IGetUnreadsRequest 
   * @returns {Promise<any>} 
   * @memberof PlaceApi
   */
  public getUnreads(IGetUnreadsRequest: IGetUnreadsRequest): Promise<any> {
    return this.api.server.request({
      cmd: 'place/count_unread_posts',
      data: IGetUnreadsRequest,
    }).then( (res) => {
      const places = res.data.counts as IGetUnreadsResponse[];
      return places;
    });
  }

  /**
   * @func get
   * @desc Requests for a place data. This API provides everything you need to know about the place
   * @param {IGetRequest} data 
   * @returns {Promise<any>} 
   * @memberof PlaceApi
   */
  public get(data: IGetRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/get',
      data,
    });
  }

  /**
   * @func getInvitations
   * @desc Retrieves a list of the given place pending invitations
   * @returns {Promise<any>} 
   * @memberof PlaceApi
   */
  public getInvitations(): Promise<any> {
    return this.api.request({
      cmd: 'account/get_invitations',
    });
  }

};
