import { Context } from "koa"

/**
 * 最终返回的结果进行统一格式返回
 * {data: 最终返回的数据, msg: 'ok', errorCode: 0}
 */
export const middWareResult = async(ctx: Context, next: () => {}) => {
    const result = await next()
    if (ctx.status === 404) {
        let content: {
            data: string|any[]|object;
            msg: string;
            errorCode: number;
        } = {
            data: result,
            msg: 'ok',
            errorCode: 0
        }
        
        ctx.set('content-type', 'application/json')
        ctx.body = JSON.stringify(content)
        ctx.status = 200
    }
}