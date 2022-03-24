import { InterfaceUser } from "../interface/InterfacaUser"
import { ExceptionUser } from "../exceptions"
import { BaseModel } from "./BaseModel"

/**
 * 用户数据模型， 负责 az_user 表的增删改查
 */
export class ModelUser extends BaseModel{

    protected tableName = 'user'

    /**
     * 通过用户id来查找用户，如果不存在则抛出异常
     * @param uid {number} 用户id
     * @returns interfaceUser.detail
     * ```
     * const udata = await ModelUser.find(1)
     * {
     *      id: 1,
     *      nickname: '用户昵称',
     *      level: 1,
     *      password: '加密后的64位密码',
     *      create_date: '2022-02-24 10:00:00'
     * }
     * ```
     */
    async get(uid: number): Promise<InterfaceUser.Detail|never>{
        const detail = await this.find<InterfaceUser.Detail>(uid)
        if (detail === null) { throw new ExceptionUser.MissUser() }
        return detail
    }
}