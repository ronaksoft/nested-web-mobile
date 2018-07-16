import IPlace from './IPlace';
import ILabel from './ILabel';
import {IUser} from './index';

interface ISuggestion {
  history?: string[];
  places?: IPlace[];
  accounts?: IUser[];
  labels?: ILabel[];
  tos?: IUser[];
  apps?: any[];
}

export default ISuggestion;
