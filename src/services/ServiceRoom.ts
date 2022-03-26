import { ExceptionRoom } from "../exceptions"
import { InterfaceZerg } from "../Interface/InterfaceZerg"
import { InterfaceRoom } from "../interface/InterfaceRoom"
import { ROOM_OPEN } from "../menu/ROOM_OPEN"
import { ROOM_FROM } from "../menu/ROOM_FROM"
import { ModelRoom } from "../models/ModelRoom"
import {date} from '../utils/utils'
import { getZergDetail, getZergPlayUrl } from '../zerg/index'


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
    static async getList(start: number, count: number) {
        const list = await ModelRoom.select({
            open: ROOM_OPEN.PUBLIC
        }, start, count)
        return list
    }

    /**
     * 创建房间
     * @param data 
     * @returns InterfaceRoom.detail 
     */
    static async create(data: InterfaceRoom.detail): Promise<InterfaceRoom.detail> {
        data.create_date = date('y-m-d h:i:s')
        const roomID = await ModelRoom.create(data)
        return Object.assign({id: roomID}, data)
    }

    /**
     * 获取房间详情
     * @param room_id {number} 房间id
     * @param current_uid  {number} 当前用户id
     * @returns 
     */
    static async get(room_id: number, current_uid: number) {
        const room = await ModelRoom.get(room_id)
        if (room === null) { throw new ExceptionRoom.NotDetail() }
        const {title, des, create_date, open, id, master_id} = room
        const _from = ~~room.from
        const is_master = master_id === current_uid
        let from_data = await getZergDetail(_from, room.from_id)
        if (from_data === null) { throw new ExceptionRoom.NotDetail('数据异常') }
        const data:InterfaceRoom.detailForm<InterfaceZerg.Detail> = {
            id: id as number, master_id, is_master, from: _from, title, des, open, create_date: create_date as string, from_data
        }
        return data
    }

    /**
     * 播放链接
     * @param form 
     * @param targetUrl
     * @returns 
     */
    static async getPlayUrl(from: number, targetUrl: string): Promise<string> {
        let playUrl = await getZergPlayUrl(from, targetUrl)
        if (playUrl === null) { throw new ExceptionRoom.MissPlayLink() }
        return playUrl
    }


    /**
     * 关闭房间
     */
    static async deleteByID(room_id: number) {
        return await ModelRoom.delete(room_id)
    }
}