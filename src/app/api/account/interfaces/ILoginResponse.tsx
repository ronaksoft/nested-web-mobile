import IUser from './IUser';
interface ILoginResponse {
  account: IUser;
  server_timestamp: number;
  _sk: string;
  _ss: string;
}

export default ILoginResponse;