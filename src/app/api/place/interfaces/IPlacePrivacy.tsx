import C_PLACE_RECEPTIVE  from './../../consts/CPlaceReceptive';

interface IPlacePolicy {
    locked: boolean;
    search: boolean;
    receptive: C_PLACE_RECEPTIVE;
}

export default IPlacePolicy;
