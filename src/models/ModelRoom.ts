

import { BaseModel } from './BaseModel'
import { InterfaceRoom } from '../interface/InterfaceRoom'
import { date } from '../utils/utils'
import { OP } from 'mysql-curd'

export class ModelRoom extends BaseModel{

    protected tableName: string = 'room'

    static instance: ModelRoom

    static getInstance() {
        if (this.instance) { return this.instance }
        this.instance = new ModelRoom('room')
        return this.instance
    }

    /**
     * @param where {object} 查询条件 {open: '1'}
     * @param start {number} 从第几条开始
     * @param end   {number} 获取多少条
     * @returns 不为空返回数组，空返回null
     * ```
     *  const rooms = ModelRoom.select({open: '1'}, 10) // 从下标为0开始获取10条
     *  const rooms2 = ModelRoom.select({open: '1'}, 10, 10) // 从下标为10开始获取10条
     * ```
     */
    static async select(where: object = {},start: number, end?: number): Promise< null | InterfaceRoom.detail[] > {
        if (end === undefined) {
            end = start
            start = 0
        }
        const modelRoom = this.getInstance()
        const outDate = Date.now() - 2 * 24 * 3600 * 1000
        return modelRoom.selete({
            and: Object.assign(
                {
                    delete_date: null,
                    create_date: [OP.GT, date('y-m-d h:i:s', new Date(outDate))]
                }, where),
            limit: [start, end]
        })
    }

    static async create(data: InterfaceRoom.detail) {
        const modelRoom = this.getInstance()
        return modelRoom.insert(data).then(res => res.insertId)
    }

    static async get(room_id: number) {
        const modelRoom = this.getInstance()
        return modelRoom.find<InterfaceRoom.detail>(room_id)
    }

    static async delete(room_id: number) {
        const modelRoom = this.getInstance()
        modelRoom.update({delete_date: date('y-m-d h:i:s')}, {and: {id: room_id}})
    }
}