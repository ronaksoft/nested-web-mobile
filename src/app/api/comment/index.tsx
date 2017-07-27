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
import IGetCommentRequest from './interfaces/IGetRequest';
import IComment from './interfaces/IComment';
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
   * Creates an instance of CommentApi.
   * @memberof CommentApi
   */
  constructor() {
    this.api = Api.getInstance();
  }

  /**
   * @func get
   * @desc Requests for some comments using the provided camma separated Ids
   * @param {IGetCommentRequest} data
   * @returns {Promise<any>}
   * @memberof CommentApi
   */
  public get(data: IGetCommentRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get_many_comments',
      data,
    }).then((res) => {
      const comments = res.comments[0] as IComment;
      return comments;
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
