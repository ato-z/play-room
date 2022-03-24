import { InterfaceUser } from "../interface/InterfacaUser";
import shajs from 'sha.js'
import { InterfaceToken } from "../interface/InterfaceToken";
import config from "../config"
import { ExceptionToken } from "../exceptions";
import { ModelUser } from "../models/ModelUser";
const loginMap = new Map()
const modelUser = new ModelUser('user')

export class ServiceToken{

    /**
     * 获取token详情
     * @param token {string} token键
     * @returns 
     */
    static get(token: string): InterfaceToken.Detail|never{
        this.hasIn(token)
        return loginMap.get(token)
    }

    /**
     * 校验token是否有效
     * @param token {string} token键
     * @returns 不存在抛出异常
     */
    static hasIn(token: string): boolean|never {
        if (loginMap.has(token) === false) { throw new ExceptionToken.Miss() }
        return true
    }

    /**
     * 用户登录到token，返回token到密钥
     * @param udata {InterfaceUser.Detail} 用户信息
     * @returns 一串不等长的密钥
     * ```
     * const udata = await ModuleUser.find(1)
     * ServiceToken.login(udata) // tokenKey => 1as14as14aaeef11454646456462164
     * ```
     */
    static login(udata: InterfaceUser.Detail): string{
        const {id, level, nickname} = udata
        const tokenKey = this.codeTokenKey(udata)
        const current = Date.now()
        const tokenDatail: InterfaceToken.Detail = {
            id: id as number, level, nickname,
            exp_time: config.expTime + current
        }
        loginMap.set(tokenKey, tokenDatail)
        return tokenKey
    }

    /**
     * 根据用户特征来返回一段token密钥
     * @param udata {InterfaceUser.Detail} 用户信息
     * @returns 一串不等长的密钥
     * ```
     * const udata = await ModuleUser.find(1)
     * ServiceToken.codeTokenKey(udata) // tokenKey => 1as14as14aaeef11454646456462164
     * ```
     */
    static codeTokenKey(udata: InterfaceUser.Detail): string{
        const currnt = Date.now()
        return new shajs.sha256()
        .update(`${currnt}${udata.id}`)
        .digest('hex')
    }
}