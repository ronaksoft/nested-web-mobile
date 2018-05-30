import {IUser, IPlace, IPost, IComment, ILabel} from 'api/interfaces';

interface IPostActivity {
  _id: string;
  action: number;
  timestamp: number;
  actor_id?: string;
  actor?: IUser;
  comment_id?: string;
  comment?: IComment;
  label_id?: string;
  label?: ILabel;
  new_place_id?: string;
  new_place?: IPlace;
  old_place_id: string;
  old_place?: IPlace;
  places?: IPlace[];
  post?: IPost;
}

export default IPostActivity;
