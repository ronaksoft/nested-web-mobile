interface IPlaceConjuction {
    id: string;
    name: string;
    picture: string;
    expanded: boolean;
    isOpen: boolean;
    depth: number;
    childrenUnseen: boolean;
    unreadPosts: number;
    hasChildren: boolean;
    isChildren: boolean;
}

export default IPlaceConjuction;
