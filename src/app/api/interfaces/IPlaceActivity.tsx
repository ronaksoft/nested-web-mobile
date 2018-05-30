import {IUser, IPlace, IPost, IComment, ILabel} from 'api/interfaces';

interface IPlaceActivity {
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
  member_id?: string;
  member?: IUser;
  place_id?: string;
  place?: IPlace;
  post_id?: string;
  post?: IPost;
  post_preview?: any;
  post_subject?: any;
}

export default IPlaceActivity;
