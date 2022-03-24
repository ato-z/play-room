import {createContainer, Lifetime} from 'awilix'
import { scopePerRequest, loadControllers } from 'awilix-koa'
import { middWareCrossDomain } from './middleware/middWareCrossDomain'
import { middWareEmpty } from './middleware/middWareEmpty'
import { middWareException } from './middleware/middWareException'
import { middWareToken } from './middleware/middWareToken'
import { middWareResquestBody } from './middleware/middWareResquestBody'
import { middWareResult } from './middleware/middWareResult'
import Koa from 'koa'
import config from './config'

const app = new Koa()

/** 中间件处理流程 */
app.use(middWareCrossDomain) // 跨域
app.use(middWareException) // 异常
app.use(middWareToken) // 异常
app.use(middWareResquestBody) // 请求体
app.use(middWareResult) // 返回格式

/** ioc */
// 创建容器
const contriller = createContainer()
// 路由注入容器中
app.use(scopePerRequest(contriller))
// 加载控制器路由
app.use(loadControllers(`${__dirname}/controller/*/*`, {
    formatName: 'camelCase',
    resolverOptions: {
        lifetime: Lifetime.SINGLETON
    }
}))

/** 404 放置最后 */
app.use(middWareEmpty)

/** 开启服务 */
const ip: string = config.runIp
const port: number = config.runPort
app.listen(port, ip, () => {
    console.log(`http://${ip}:${port}`)
})
