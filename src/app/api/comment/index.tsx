import Api from 'api';
import IGetRequest from './interfaces/IGetRequest';

export default class CommentApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public get(data: IGetRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get_comments',
      data,
    });
  }
};
