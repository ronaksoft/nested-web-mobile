import IPlaceLimits from './IPlaceLimits';
import IPicture from '../../interfaces/IPicture';
import IPlacePolicy from './IPlacePolicy';
import IPlacePrivacy from './IPlacePrivacy';
import C_PLACE_TYPE from '../../consts/CPlaceType';

interface IPlace {
    _id: string;
    created_on: number;
    creators: Array<string>;
    description: string;
    grand_parent_id: string;
    groups: any;
    limits: IPlaceLimits;
    name: string;
    picture: IPicture;
    policy: IPlacePolicy;
    privacy: IPlacePrivacy;
    type: C_PLACE_TYPE;
    unlocked_childs: Array<any>;
}

export default IPlace;
