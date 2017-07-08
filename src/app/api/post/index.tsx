import Api from 'api';
import IPostsListRequest from './interfaces/IPostsListRequest';
import IPostsListResponse from './interfaces/IPostsListResponse';

export default class NotificationApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public getFavoritePosts(params: IPostsListRequest = {limit: 10}): Promise<IPostsListResponse> {
    return this.api.server.request({
      cmd: 'account/get_favorite_posts',
      data: params,
    }).then((res: any) => {
      const data = res.data as IPostsListResponse;
      return data;
    }).catch((err) => {
      console.log(err);
      return err;
    });
  }
}
