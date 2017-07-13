import IPlace from 'api/place/interfaces/IPlace';
import IUser from 'api/account/interfaces/IUser';

interface ISearchForComposeResponse {
  places: IPlace[];
  recipients: IUser[];
}

export default ISearchForComposeResponse;