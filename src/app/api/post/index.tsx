import Api from 'api';
import IPostsListRequest from './interfaces/IPostsListRequest';
import IPostsListResponse from './interfaces/IPostsListResponse';
import IGetPostRequest from './interfaces/IGetRequest';
import ISendRequest from './interfaces/ISendRequest';
import ISendResponse from './interfaces/ISendResponse';
import ICommentListRequest from './interfaces/ICommentListRequest';

export default class PostApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public getPost(postId: string) {
    return this.api.request({
      cmd: 'post/get',
      data: {
        post_id: postId,
      },
    });
  }

  public pinPost(postId: string) {
    return this.api.request({
      cmd: 'post/pin',
      data: {
        post_id: postId,
      },
    });
  }

  public unpinPost(postId: string) {
    return this.api.request({
      cmd: 'post/unpin',
      data: {
        post_id: postId,
      },
    });
  }

  public getFavoritePosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    return this.api.request({
      cmd: 'account/get_favorite_posts',
      data: params,
    });
  }

  public get(data: IGetPostRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get',
      data,
    });
  }

  public send(data: ISendRequest): Promise<ISendResponse> {
    data.content_type = data.content_type || 'text/plain';
    return this.api.request({
      cmd: 'post/add',
      data,
    });
  }

 public getComments(params: ICommentListRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get_comments',
      data: params,
    }).then((res) => {
      return res.comments;
    });
  }
}
