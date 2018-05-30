/**
 * @file api/post/index.tsx
 * @author Soroush Torkzadeh <sorousht@nested.com>
 * @desc All APIs are related to Post
 * @export PlaceApi
 * Documented by:         Soroush Torkzadeh
 * Date of documentation: 2017-07-27
 * Reviewed by:           -
 * Date of review:        -
 */
import Api from 'api';
import IPostsListRequest from './interfaces/IPostsListRequest';
import IPostsListResponse from './interfaces/IPostsListResponse';
import IGetPostRequest from './interfaces/IGetRequest';
import ISendRequest from './interfaces/ISendRequest';
import IEditRequest from './interfaces/IEditRequest';
import ISendResponse from './interfaces/ISendResponse';
import ICommentListRequest from './interfaces/ICommentListRequest';
import IAddLabelRequest from './interfaces/IAddLabelRequest';
import IRemoveLabelRequest from './interfaces/IRemoveLabelRequest';
import {IGetActivitiesRequest, IGetActivitiesResponse} from './interfaces/IPostActivities';
import {IPlaceActivity} from '../interfaces';

export default class PostApi {
  /**
   * @prop api
   * @desc An instance of Api
   * @private
   * @memberof PostApi
   */
  private api;

  /**
   * Creates an instance of PostApi.
   * @memberof PostApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func getPost
   * @desc Requests for a post data with full body
   * @param {string} postId
   * @param {boolean} [markRead=false]
   * @returns
   * @memberof PostApi
   */
  public getPost(postId: string, markRead: boolean = false) {
    // TODO: Remove it. It's exactly the same with `get`
    return this.api.request({
      cmd: 'post/get',
      data: {
        post_id: postId,
        mark_read: markRead,
      },
    });
  }

  /**
   * @func pinPost
   * @desc Pin a post by the post Id
   * @param {string} postId
   * @returns
   * @memberof PostApi
   */
  public pinPost(postId: string) {
    return this.api.request({
      cmd: 'post/pin',
      data: {
        post_id: postId,
      },
    });
  }

  /**
   * @func unpinPost
   * @desc Unpin a post by the post Id
   * @param {string} postId
   * @returns
   * @memberof PostApi
   */
  public unpinPost(postId: string) {
    return this.api.request({
      cmd: 'post/unpin',
      data: {
        post_id: postId,
      },
    });
  }

  /**
   * @func getFavoritePosts
   * @desc Retrieves the posts of places that where added to feed sorted by date
   * @param {IPostsListRequest} [params={limit: 10}]
   * @returns {Promise<IPostsListResponse>}
   * @memberof PostApi
   */
  public getFavoritePosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    return this.api.request({
      cmd: 'account/get_favorite_posts',
      data: params,
    });
  }

  /**
   * @func getPlacePostsAllSortedByActivity
   * @desc Retrieves a list of the given place's posts sorted by latest activity
   * @param {IPostsListRequest} [params={limit: 10}]
   * @returns {Promise<IPostsListResponse>}
   * @memberof PostApi
   */
  public getPlacePosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    params.by_update = true;
    return this.api.request({
      cmd: 'place/get_posts',
      data: params,
    });
  }

  /**
   * @func getPlacePostsUnreadSortedByRecent
   * @desc Retrieves unread posts of the given place sorted by date
   * @param {IPostsListRequest} [params={limit: 10}]
   * @returns {Promise<IPostsListResponse>}
   * @memberof PostApi
   */
  public getPlaceUnreadPosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    return this.api.request({
      cmd: 'place/get_unread_posts',
      data: params,
    });
  }

  /**
   * @func getBockmarkedPosts
   * @desc Retrieves bookmarked posts of the given place
   * @param {IPostsListRequest} [params={limit: 10}]
   * @returns {Promise<IPostsListResponse>}
   * @memberof PostApi
   */
  public getBockmarkedPosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    // TODO: The function name has spelling issue
    return this.api.request({
      cmd: 'account/get_pinned_posts',
      data: params,
    });
  }

  /**
   * @func getBockmarkedPosts
   * @desc Retrieves all sent posts
   * @param {IPostsListRequest} [params={limit: 10}]
   * @returns {Promise<IPostsListResponse>}
   * @memberof PostApi
   */
  public getSentPosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    return this.api.request({
      cmd: 'account/get_sent_posts',
      data: params,
    });
  }

  /**
   * @func get
   * @desc Requests for a post data with full body
   * @param {IGetPostRequest} data
   * @returns {Promise<any>}
   * @memberof PostApi
   */
  public get(data: IGetPostRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get',
      data,
    });
  }

  public markAsRead(postId: string): Promise<any> {
    return this.api.request({
      cmd: 'post/mark_as_read',
      data: {
        post_id: postId,
      },
    });
  }

  public getMany(data: IGetPostRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get_many',
      data,
    });
  }

  /**
   * @func send
   * @desc Shares a post with the specified targets
   * @param {ISendRequest} data
   * @returns {Promise<ISendResponse>}
   * @memberof PostApi
   */
  public send(data: ISendRequest): Promise<ISendResponse> {
    data.content_type = data.content_type || 'text/plain';
    return this.api.request({
      cmd: 'post/add',
      data,
    });
  }

  /**
   * @func edit
   * @desc Edit the post
   * @param {IEditRequest} data
   * @returns {Promise<any>}
   * @memberof PostApi
   */
  public edit(data: IEditRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/edit',
      data,
    });
  }

  /**
   * @func getComments
   * @desc Retrieves a post comments. You can customize the result with both skip/limit and before/after
   * @param {ICommentListRequest} params
   * @returns {Promise<any>}
   * @memberof PostApi
   */
  public getComments(params: ICommentListRequest): Promise<any> {
    // TODO: Move to api/comment
    return this.api.request({
      cmd: 'post/get_comments',
      data: params,
    }).then((res) => {
      return res.comments;
    });
  }

  /**
   * @func addLabel
   * @desc Adds label to a post (comma separated supported)
   * @param {IAddLabelRequest} params
   * @returns {Promise<any>}
   * @memberof PostApi
   */
  public addLabel(params: IAddLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/add_label',
      data: params,
    });
  }

  /**
   * @func removeLabel
   * @desc Removes label from a post
   * @param {IRemoveLabelRequest} params
   * @returns {Promise<any>}
   * @memberof PostApi
   */
  public removeLabel(params: IRemoveLabelRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/remove_label',
      data: params,
    });
  }

  public getActivities(data: IGetActivitiesRequest): Promise<IPlaceActivity[]> {
    return this.api.request({
      cmd: 'post/get_activities',
      data,
    }).then((res: IGetActivitiesResponse) => {
      return res.activities;
    });
  }
}
