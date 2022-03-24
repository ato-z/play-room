export module InterfaceZerg{
    export interface Li{
        title: string;
        href: string
    }
    export interface ListProp{
        title: string;
        li: Li[]
    }
    export interface Detail{
        poster: string;
        title: string;
        des: string,
        list: ListProp[]
    }
}