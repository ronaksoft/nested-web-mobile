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
import IAccountPlacesRequest from './interfaces/IAccountPlacesRequest';
import IGetUnreadsRequest from './interfaces/IGetUnreadsRequest';
import IGetUnreadsResponse from './interfaces/IGetUnreadsResponse';
// import IGetRequest from './interfaces/IGetRequest';
import {IPlace, IUser} from 'api/interfaces';
import IGetWithSkipRequest from './interfaces/IGetWithSkipRequest';
import IPlaceMemberRequest from './interfaces/IPlaceMemberRequest';
import IGetFilesRequest from './interfaces/IGetFilesRequest';
import IFile from '../../components/FileItem/IFile';
import IGetPlaceActivitiesRequest from './interfaces/IGetActivitiesRequest';
import IGetPLaceActivitiesResponse from './interfaces/IGetActivitiesResponse';
import {IPlaceActivity} from 'api/interfaces/';

export default class PlaceApi {
  /**
   * @desc An instance of Api
   * @prop api
   * @private
   * @memberof PlaceApi
   */
  private api;

  /**
   * Creates an instance of PlaceApi.
   * @memberof PlaceApi
   */
  constructor() {
    this.api = Api.getInstance();
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
    }).then((res) => res.data.places as IPlace[]);
  }

  public getActivities(data: IGetPlaceActivitiesRequest): Promise<IPlaceActivity[]> {
    return this.api.request({
      cmd: 'place/get_activities',
      data,
    }).then((res: IGetPLaceActivitiesResponse) => {
      return res.activities;
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
  // public get(data: IGetRequest): Promise<any> {
  //   return this.api.request({
  //     cmd: 'place/get',
  //     data,
  //   });
  // }
  public get(placeId: string): Promise<any> {
    return this.api.request({
      cmd: 'place/get',
      data: {
        place_id: placeId,
      },
    });
  }

  /**
   * @func getMangers
   * @desc Get Mangers of a place
   * @param {IGetWithSkipRequest} data
   * @returns {Promise<any>}
   * @memberof PlaceApi
   */
  public getMangers(data: IGetWithSkipRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/get_creators',
      data,
    }).then( (res) => {
      const users = res.creators as IUser[];
      return users;
    });
  }

  /**
   * @func getMembers
   * @desc Get Members of a place
   * @param {IGetWithSkipRequest} data
   * @returns {Promise<any>}
   * @memberof PlaceApi
   */
  public getMembers(data: IGetWithSkipRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/get_key_holders',
      data,
    }).then( (res) => {
      const users = res.key_holders as IUser[];
      return users;
    });
  }

  /**
   * @func getFiles
   * @desc Get Files of a place
   * @param {IGetFilesRequest} data
   * @returns {Promise<any>}
   * @memberof PlaceApi
   */
  public getFiles(data: IGetFilesRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/get_files',
      data,
    }).then( (res) => {
      const files = res.files as IFile[];
      return files;
    });
  }

  /**
   * @func promoteMember
   * @desc Promote Members of a place
   * @param {IPlaceMemberRequest} data
   * @returns {Promise<any>}
   * @memberof PlaceApi
   */
  public promoteMember(data: IPlaceMemberRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/promote_member',
      data,
    });
  }

  /**
   * @func demoteMember
   * @desc Demote Members of a place
   * @param {IPlaceMemberRequest} data
   * @returns {Promise<any>}
   * @memberof PlaceApi
   */
  public demoteMember(data: IPlaceMemberRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/demote_member',
      data,
    });
  }

  /**
   * @func removeMember
   * @desc Remove Members of a place
   * @param {IPlaceMemberRequest} data
   * @returns {Promise<any>}
   * @memberof PlaceApi
   */
  public removeMember(data: IPlaceMemberRequest): Promise<any> {
    return this.api.request({
      cmd: 'place/remove_member',
      data,
    });
  }

};
