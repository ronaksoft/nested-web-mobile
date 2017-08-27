/**
 * @file api/comment/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc Comment related APIs
 * @export CommentApi
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-27
 * Reviewed by:           -
 * Date of review:        -
 */

import Api from 'api';
import RequestBundle from 'api/requestBundle';
import ICreateLabelRequest from './interfaces/ICreateLabelRequest';
import IUpdateLabelRequest from './interfaces/IUpdateLabelRequest';
import IRemoveLabelRequest from './interfaces/IRemoveLabelRequest';
import ISearchLabelRequest from './interfaces/ISearchLabelRequest';
import CLabelFilterTypes from './consts/CLabelFilterTypes';
import IGetRequestLabelRequest from './interfaces/IGetRequestLabelRequest';
import IRequestLabelRequest from './interfaces/IRequestLabelRequest';
import IUpdateRequestLabelRequest from './interfaces/IUpdateRequestLabelRequest';
import ICancelRequestLabelRequest from './interfaces/ICancelRequestLabelRequest';
import IGetMembersLabelRequest from './interfaces/IGetMembersLabelRequest';
import IAddMemberLabelRequest from './interfaces/IAddMemberLabelRequest';
import IGetLabelRequest from './interfaces/IGetLabelRequest';

/**
 * @class CommentApi
 * @desc APIs to work with comment
 */
export default class LabelApi {
  /**
   * @prop api
   * @desc An instance of Api
   * @private
   * @memberof CommentApi
   */
  private api;

  /**
   * @prop requestBundle
   * @desc An instance of requestBundle
   * @private
   * @memberof LabelApi
   */
  private requestBundle;

  /**
   * Creates an instance of CommentApi.
   * @memberof LabelApi
   */
  constructor() {
    this.api = Api.getInstance();
    this.requestBundle = RequestBundle.getInstance();
  }

  /**
   * @func update
   * @desc Creates a label
   * @param {ICreateLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public create(params: ICreateLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/create',
      data: params,
    });
  }

  /**
   * @func update
   * @desc Updates a label
   * @param {IUpdateLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public update(params: IUpdateLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/update',
      data: params,
    });
  }

  /**
   * @func remove
   * @desc Removes a label
   * @param {IRemoveLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public remove(params: IRemoveLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/remove',
      data: params,
    });
  }

  /**
   * @func search
   * @desc Search labels database
   * @param {ISearchLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public search(params: ISearchLabelRequest = {details: true, filter: CLabelFilterTypes.ALL}): Promise<any> {
    console.log(params);
    return this.api.request({
      cmd: 'search/labels',
      data: params,
    });
  }
  /**
   * @func getRequests
   * @desc Gets requests
   * @param {IGetRequestLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public getRequests(params: IGetRequestLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/get_requests',
      data: params,
    });
  }

  /**
   * @func request
   * @desc Requests a label (either joining or creating, for joining you should provide label_id)
   * @param {IRequestLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public request(params: IRequestLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/request',
      data: params,
    });
  }

  /**
   * @func updateRequest
   * @desc Updates request
   * @param {IUpdateRequestLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public updateRequest(params: IUpdateRequestLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/update_request',
      data: params,
    });
  }

  /**
   * @func cancelRequest
   * @desc Cancels request
   * @param {ICancelRequestLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public cancelRequest(params: ICancelRequestLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/remove_request',
      data: params,
    });
  }

  /**
   * @func getMembers
   * @desc Gets members of a label
   * @param {IGetMembersLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public getMembers(params: IGetMembersLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/get_members',
      data: params,
    });
  }

  /**
   * @func addMember
   * @desc Adds member(s) to label, (comma separated)
   * @param {IAddMemberLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public addMember(params: IAddMemberLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/add_member',
      data: params,
    });
  }

  /**
   * @func removeMember
   * @desc Removes a member from a label
   * @param {IAddMemberLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public removeMember(params: IAddMemberLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/remove_member',
      data: params,
    });
  }

  /**
   * @func get
   * @desc Requests for some labels using the provided comma separated Ids
   * @param {IGetLabelRequest} params
   * @returns {Promise<any>}
   * @memberof LabelApi
   */
  public get(params: IGetLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'label/get_many',
      data: params,
    });
  }
};
