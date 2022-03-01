import {C, R, U, spotTable} from '../utils/db'
import { ExceptionUser } from "../exceptions";
import { interfaceRoom } from '../interface/interfaceRoom';
const tableRoom = spotTable('room')
const inserFields =  ['title', 'des', 'open', 'from', 'from_id', 'master_id', 'create_date']
const [insertRoom] = C(tableRoom, inserFields)
const [upRoom] = U(tableRoom)
const [findRoom, filterRoom] = R(tableRoom, {
    field: ['id, title, create_date, des, open, from, from_id, master_id'], // 对查询语句的字段嗮选， 可缺省
    order: ['id DESC'], // 查询结果根据id进行倒序， 可缺省
})

export {insertRoom, upRoom, findRoom}

export class ModelRoom{
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
    static async select(where: object = {},start: number, end?: number): Promise< null | interfaceRoom.detail[] > {
        if (end === undefined) {
            end = start
            start = 0
        }
        return filterRoom(Object.assign({
            delete_date: null
        }, where), null, [start, end]) as interfaceRoom.detail[]
    }

    static async create(data: interfaceRoom.detail) {
        return insertRoom(data).then(result => result.insertId)
    }

    static async get(room_id) {
        return findRoom({id: room_id, delete_date: null})
    }
}