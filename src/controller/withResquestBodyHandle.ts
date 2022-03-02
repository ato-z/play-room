import { Context } from "koa";

/** 获取请求体的body数据 */
const getBodtByCtx = (ctx: Context): Promise<string> => {
    return new Promise(resolve => {
        let body = ''
        ctx.req.on('data', chunk => body += chunk)
        ctx.req.on('end', () => resolve(body))
    })
}

/** 接受json数据 */
const takeJSONByCtx = (ctx: Context, contentType: string, body: string) => {
    if (contentType !== 'application/json') { return }
    let data = {}
    try {
        data = JSON.parse(body)
    } catch(error) {data = body}
    ctx.bodyJSON = data
}

/** 接受 x-www-form-urlencoded 数据 */
const takeFormDataByCtx = (ctx: Context, contentType: string, body: string) => {
    if (/x-www-form-urlencoded/i.test(contentType) === false) { return }
    const entries = body.split('&').map(item => item.split(''))
    console.log(entries)
}

/**
 * 对请求体的数据进行处理
 */
export default async(ctx: Context, next: () => {}) => {
    if (/post/i.test(ctx.request.method)) {
        const contentType = (ctx.header['content-type'] || ctx.header['CONTENT-TYPE'] || ctx.header['ContentType']) as string
        const bodyString = await getBodtByCtx(ctx)
        takeJSONByCtx(ctx, contentType, bodyString)
        takeFormDataByCtx(ctx, contentType, bodyString)
    }
    
    await next()
}