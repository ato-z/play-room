export module interfaceRoom{

    export interface listQuery{
        start: string;
        count: string;
    }

    export interface detail{
        id?: number;
        title: string;
        des: string;
        from: number;
        from_id: number;
        master_id: number;
        create_date: string;
        delete_date?: string;
    }
}