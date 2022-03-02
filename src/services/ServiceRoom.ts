import { ExceptionRoom } from "../exceptions";
import { interfaceACG } from "../interface/interfaceACG";
import { interfaceRoom } from "../interface/interfaceRoom";
import { ROOM_FROM } from "../menu/ROOM_FROM";
import { ROOM_OPEN } from "../menu/ROOM_OPEN";
import { ModelRoom } from "../models/ModelRoom";
import {date} from '../utils/utils'
import { ServiceACGTV } from "./ServiceACGTV";

export class ServiceRoom{

    /**
     * @param start {number} 从第几条开始
     * @param count   {number} 获取多少条
     * @returns 不为空返回数组，空返回null
     * ```
     *  const rooms = ModelRoom.select({open: '1'}, 10) // 从下标为0开始获取10条
     *  const rooms2 = ModelRoom.select({open: '1'}, 10, 10) // 从下标为10开始获取10条
     * ```
     */
    static async getList(start, count) {
        const list = await ModelRoom.select({
            open: ROOM_OPEN.PUBLIC
        }, start, count)
        return list
    }

    /**
     * 创建房间
     * @param data 
     * @returns interfaceRoom.detail 
     */
    static async create(data: interfaceRoom.detail): Promise<interfaceRoom.detail> {
        data.create_date = date('y-m-d h:i:s')
        const roomID = await ModelRoom.create(data)
        return Object.assign({id: roomID}, data)
    }

    static async get(room_id: number, current_uid: number) {
        const room = await ModelRoom.get(room_id)
        if (room === null) { throw new ExceptionRoom.NotDetail() }
        const {title, des, create_date, open, id, master_id} = room
        const is_master = master_id === current_uid
        if (room.from === ROOM_FROM.AGETV) {
            const from_data = await ServiceACGTV.getDetailById(room.from_id)
            const data:interfaceRoom.detailForm<interfaceACG.acgDetail> = {
                id, master_id, is_master, title, des, open, create_date, from_data
            }
            return data
        }
        throw new ExceptionRoom.NotDetail('数据异常')
    }
}