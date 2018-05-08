import {IUser} from './';

interface ILabel {
  title: string;
  code: string;
  'public': boolean;
  counters: any;
  top_members: IUser[];
  is_member: boolean;
  _id: string;
}

export default ILabel;
