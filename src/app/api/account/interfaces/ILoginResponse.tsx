import {IUser} from 'api/interfaces';
interface ILoginResponse {
  account: IUser;
  server_timestamp: number;
  _sk: string;
  _ss: string;
}

export default ILoginResponse;