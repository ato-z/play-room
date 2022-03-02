import config from "../config"
import { ExceptionWSS } from "../exceptions"
const {WebSocketServer} = require('ws')

let start = config.wxStartPort

export class ServiceWs{
    static portOpen: {[propName: string]: boolean} = {}
    public port: number
    private wss: typeof WebSocketServer
    private setIntervalIndex: NodeJS.Timer

    constructor() {
        const port = this.getPort()
        this.port = port
        const wss = new WebSocketServer({ port: port })
        this.wss = wss
        this.init()
    }

    /**
     * 统一发送到客户的数据编码格式
     */
    /**
     * 统一发送到客户的数据编码格式
     * @param data {any} 发送的数据
     * @param _code {number} 编码类型
     * @returns JSON.stringify({data, _code})
     * ```
     * ServiceWs.codeSendClientData({msg: 'opening...'}, 0) // => '{"code": 0, "data": {"msg": "opening"}}'
     * ```
     */
    static codeSendClientData<T>(data:T, _code?: number): string {
        const code = _code || 0
        return JSON.stringify({data, code})
    }

    /** 
     * 向所有用户发起广播
     */
    notify<T>(data: T): void {
        const {wss} = this
        wss.clients.forEach(function (ws) {
            ws.send(ServiceWs.codeSendClientData(data))
        })
    }

    /**
     * 初始化操作， 开启心跳包
     */
    private init() {
        const {wss} = this
        /** 每次链接成功后 */
        wss.on('connection', function connection(ws) {
            /** 标记活动用户 */
            ws.on('pong', function () {
                this.isAlive = true
            })
            /** 链接成功发送一条消息 */
            ws.send(ServiceWs.codeSendClientData({msg: 'opening...'}))
        })
        
        this.setIntervalIndex = setInterval(function ping() {
            wss.clients.forEach(function (ws) {
              if (ws.isAlive === false) return ws.terminate()
              ws.isAlive = false
              ws.ping()
            });
        }, 30000)
    }

    /**
     * 返回最近可用的一个端口号
     * @returns 
     */
    private getPort() {
        const vals = Object.entries(ServiceWs.portOpen)
        const len = vals.length
        if (len === 0) { return this.setPort(start)}
        if (len > config.maxRoom) { throw new ExceptionWSS.MaxConnect() }
        let i = 0
        while (i < len) {
            const item = vals[i++]
            if (item[1] === false) { return this.setPort(item[0]) }
        }
        return this.setPort(start += 1)
    }

    /**
     * 把端口设置成不可用状态
     * @param val 
     * @returns 
     */
    private setPort(val: string|number) {
        ServiceWs.portOpen[val] = true
        return parseInt(val as string)
    }

    /**
     * 关闭服务器
     */
    public close() {
        const {port, wss} = this
        wss.close()
        ServiceWs.portOpen[port.toString()] = false
        clearInterval(this.setIntervalIndex)
    }
}