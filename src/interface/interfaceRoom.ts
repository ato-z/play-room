export module interfaceRoom{

    export interface listQuery{
        start: string;
        count: string;
    }

    export interface createProp{
        title: string;
        open: '1'|'2';
        des: string;
        from: number;
        from_id: number;
        create_date?: string;
    }

    export interface detail extends createProp{
        id?: number;
        master_id: number;
        delete_date?: string;
    }

    export interface detailForm<T>{
        title: string;
        des: string;
        create_date: string;
        open: string;
        from_data: T
    }
}