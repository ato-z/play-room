export module interfaceRoom{

    export interface listQuery{
        start: string;
        count: string;
    }

    export interface statuProp{
        liIndex: number|null;
        itemIndex: number|null;
        playLink: string|null
    }

    export interface joinWssQuery{
        port: number;
        id: number;
    }

    export interface wsStatuProp extends statuProp{
        playWs: string;
        chatWs: string
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
        id: number,
        title: string;
        des: string;
        master_id: number,
        is_master: boolean,
        create_date: string;
        open: string;
        from_data: T
    }
}