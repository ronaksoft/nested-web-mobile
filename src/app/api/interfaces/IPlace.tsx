import IPlaceLimits from '../place/interfaces/IPlaceLimits';
import {IPicture} from './';
import IPlacePolicy from '../place/interfaces/IPlacePolicy';
import IPlacePrivacy from '../place/interfaces/IPlacePrivacy';
import C_PLACE_TYPE from '../consts/CPlaceType';

interface IPlace {
    _id: string;
    created_on?: number;
    creators?: Array<string>;
    description?: string;
    grand_parent_id?: string;
    groups?: any;
    limits?: IPlaceLimits;
    name: string;
    picture?: IPicture;
    policy?: IPlacePolicy;
    privacy?: IPlacePrivacy;
    type?: C_PLACE_TYPE;
    access?: string[];
    unlocked_childs?: Array<any>;
}

export default IPlace;
