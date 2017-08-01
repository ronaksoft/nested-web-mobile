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
import IGetCommentRequest from './interfaces/IGetRequest';
// import IComment from './interfaces/IComment';
import ISendCommentRequest from './interfaces/ISendCommentRequest';

/**
 * @class CommentApi
 * @desc APIs to work with comment
 */
export default class CommentApi {
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
   * @memberof CommentApi
   */
  private requestBundle;

  /**
   * Creates an instance of CommentApi.
   * @memberof CommentApi
   */
  constructor() {
    this.api = Api.getInstance();
    this.requestBundle = RequestBundle.getInstance();
  }

  /**
   * @func get
   * @desc Requests for some comments using the provided comma separated Ids
   * @param {IGetCommentRequest} data
   * @returns {Promise<any>}
   * @memberof CommentApi
   */
  public get(data: IGetCommentRequest): Promise<any> {
    // return this.api.request({
    //   cmd: 'post/get_many_comments',
    //   data,
    // }).then((res) => {
    //   const comments = res.comments[0] as IComment;
    //   return comments;
    // });
    console.log('comment get');
    return this.requestBundle.observeRequest('comment', data.comment_id, false, 'comment_id', this.getPrivateMany);
  }

  /**
   * @func getPrivateMany
   * @desc Requests for some comments using the provided comma separated Ids
   * @param {string} ids
   * @returns {Promise<any>}
   * @memberof CommentApi
   */
  private getPrivateMany(ids: string): Promise<any> {
    const request: IGetCommentRequest = {
      comment_id: ids,
    };
    return this.api.request({
      cmd: 'post/get_many_comments',
      request,
    });
  }

  /**
   * @func addComment
   * @desc Adds a new comment to a post
   * @param {ISendCommentRequest} data
   * @returns
   * @memberof CommentApi
   */
  public addComment(data: ISendCommentRequest) {
    return this.api.request({
      cmd: 'post/add_comment',
      data,
    });
  }
};
