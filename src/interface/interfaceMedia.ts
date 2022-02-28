export module interfaceMedia{
    export interface videoQuery{
        from: string;
        video_id: string
    }

    export interface playQuery{
        from: string;
        target: string
    }
}