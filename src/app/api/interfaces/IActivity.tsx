import {IUser, IPlace} from 'api/interfaces'

interface IActivity {
  action: number;
  comment_id: string;
  label_id: string;
  new_place_id: string;
  old_place_id: string;
  places: string[];
  timestamp: number;
  _id: string;
  member: IUser;
  member_id: string;
  actor: IUser;
  actor_id: string;
  place: IPlace;
  place_id: string;
  post: any;
  post_id: string;
  new_place?: any;
  post_preview?: any;
  post_subject?: any;
  old_place?: any;
  comment_text?: any;
  label?: any;
}
// interface IActivityNoDetail {
//   action: number;
//   actor_id: string;
//   comment_id: string;
//   label_id: string;
//   member_id: string;
//   new_place_id: string;
//   old_place_id: string;
//   place_id: string;
//   post_id: string;
//   timestamp: number;
//   places: any;
//   _id: string;
// }
export default IActivity;
