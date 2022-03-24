import { Context } from "koa"

// 未查询到的路由返回404
export const middWareEmpty = (ctx: Context) => {
    ctx.state = 404
    ctx.body = '{"msg": "404 NOT FOUND", errorCode: 0}'
}