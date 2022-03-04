import {createContainer, Lifetime} from 'awilix'
import { scopePerRequest, loadControllers } from 'awilix-koa'
import exceptionHandle from './exceptions/exceptionHandle'
import withResultHandle from './controller/withResultHandle'
import withResquestBodyHandle from './controller/withResquestBodyHandle'
import withTokenHandle from './controller/withTokenHandle'
import Koa from 'koa'
import config from './config'

const app = new Koa() 

// 开启跨域
app.use(async (ctx, next) => {
    if (config.crossDomain) {
        ctx.set('Access-Control-Allow-Origin', '*');
        ctx.set('Access-Control-Allow-Headers', '*');
        ctx.set('Access-Control-Allow-Methods', 'PUT, POST, GET, DELETE, OPTIONS');
    }
    await next()
})

// 异常捕获
app.use(exceptionHandle)

// 请求体处理
app.use(withResquestBodyHandle)

// 登录校验
app.use(withTokenHandle)

// 统一返回的数据格式类型
app.use(withResultHandle)

// 创建容器
const contriller = createContainer()

// 路由注入容器中
app.use(scopePerRequest(contriller))

// 加载控制器路由
app.use(loadControllers(`${__dirname}/controller/*/*.ts`, {
    formatName: 'camelCase',
    resolverOptions: {
        lifetime: Lifetime.SINGLETON
    }
}))

const ip: string = config.runIp
const port: number = config.runPort
app.listen(port, ip, () => {
    console.log(`http://${ip}:${port}`)
})