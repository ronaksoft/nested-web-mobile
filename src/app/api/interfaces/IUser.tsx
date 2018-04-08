import {IPicture} from './';
import IAccountCounters from '../account/interfaces/IAccountCounters';

interface IUser {
  _id: string;
  picture: IPicture;
  disabled: boolean;
  dob: string;
  email: string;
  lname: string;
  fname: string;
  gender: string;
  phone: string;
  registered: string;
  admin: boolean;
  counters: IAccountCounters;
};

export default IUser;
