interface ISidebarPlace {
    id: string;
    expanded: boolean;
    isOpen: boolean;
    depth: number;
    hasChildren: boolean;
    isChildren: boolean;
    isSelected: boolean;
}

export default ISidebarPlace;
