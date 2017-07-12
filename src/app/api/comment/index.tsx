import Api from 'api';
import IGetCommentRequest from './interfaces/IGetRequest';
import IComment from './interfaces/IComment';

export default class CommentApi {
  private api;

  constructor() {
    this.api = Api.getInstance();
  }

  public get(data: IGetCommentRequest): Promise<any> {
    return this.api.request({
      cmd: 'post/get_many_comments',
      data,
    }).then((res) => {
      const comments = res.comments[0] as IComment;
      return comments;
    });
  }
};