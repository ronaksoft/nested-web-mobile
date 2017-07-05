import IPicture from './IPicture';
import IAccountCounters from './IAccountCounters';

interface IUser {
  _id: string;
  name: string;
  family: string;
  picture: IPicture;
  disabled: boolean;
  dob: string;
  email: string;
  fname: string;
  gender: string;
  phone: string;
  registered: string;
  admin: boolean;
  counters: IAccountCounters;
};

export default IUser;
