import Api from 'api';
import IPostsListRequest from './interfaces/IPostsListRequest';
import IPostsListResponse from './interfaces/IPostsListResponse';
import IGetPostRequest from './interfaces/IGetRequest';

export default class PostApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
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
}
