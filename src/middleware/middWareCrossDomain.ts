import { Context } from "koa"
import config from '../config'

/**
 * 处理前端跨域的中间件
 */
export const middWareCrossDomain = async (ctx: Context, next: () => {}) => {
    if (config.crossDomain) {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', '*');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    }
    await next()
}