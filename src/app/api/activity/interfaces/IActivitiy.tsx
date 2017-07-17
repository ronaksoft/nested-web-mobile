interface IActivity {
  action: number;
  actor_id: string;
  comment_id: string;
  member_id: string;
  new_place_id: string;
  old_place_id: string;
  place_id: string;
  places: string[];
  post_id: string;
  timestamp: number;
  _id: string;
}

export default IActivity;
