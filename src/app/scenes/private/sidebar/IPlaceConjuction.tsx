interface IPlaceConjuction {
    id: string;
    name: string;
    picture: string;
    expanded: boolean;
    depth: number;
    childrenUnseen: boolean;
    unreadPosts: number;
    hasChildren: boolean;
    isChildren: boolean;
}

export default IPlaceConjuction;
