import { Context } from "koa"
import config from '../config'
import {BaseExceotion} from '../exceptions'
import ServiceLog from "../services/ServiceLog"

/**
 * 捕获全局异常的句柄，将错误信息统一的格式输出
 */
export const middWareException = async (ctx: Context, next: () => {}) => {
    try {
        const result = await next()
    } catch (error) {
        let code = 500
        const result = { errorCode: 999,  msg: '网络异常～' }
        if (error instanceof BaseExceotion) {
            result.errorCode = error.errorCode
            result.msg = error.message || error.msg
            code = error.code || code
        } else { // 写入日志
            if (config.debug === true) { throw error }
            const content = `${ctx.method} ${ctx.url}
header: ${JSON.stringify(ctx.header)}`
            ServiceLog.writeToDay(error, content)
        }
        ctx.set('content-type', 'application/json')
        ctx.status = code
        ctx.body = JSON.stringify(result)
    }
}