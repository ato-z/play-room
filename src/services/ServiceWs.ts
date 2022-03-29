import config from "../config"
import { ExceptionWSS } from "../exceptions"
import { WS_CODE } from "../menu/WS_CODE"
import { WebSocketServer } from 'ws'

let start = config.wxStartPort

export class ServiceWs{
    static portOpen: {[propName: string]: boolean} = {}
    public port: number
    public wsList: any[] = []
    private wss: WebSocketServer
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
     * @param data {any} 发送的数据
     * @param _code {number} 编码类型
     * @returns JSON.stringify({data, _code})
     * ```
     * ServiceWs.codeSendClientData({msg: 'opening...'}, 0) // => '{"code": 0, "data": {"msg": "opening"}}'
     * ```
     */
    static codeSendClientData<T>(data:T, _code?: number): string {
        const code = _code || WS_CODE.MSG
        return JSON.stringify({data, code})
    }

    /** 
     * 向所有用户发起广播
     */
    notify<T>(data: T, code?: number): void {
        const {wss} = this
        wss.clients.forEach( (ws) => {
            ws.send(ServiceWs.codeSendClientData(data, code))
        })
    }

    /**
     * 初始化操作， 开启心跳包
     */
    private init() {
        const {wss, wsList, port} = this
        /** 每次链接成功后 */
        wss.on('connection',  (ws: any) => {
            /** 监听用户发送的信息 */
            this.onMeassage(ws)

            /** 标记活动用户 */
            ws.on('pong', function () {
                if (ws) { Reflect.set(ws, 'isAlive', true) }
            })
            const linkNum = this.wsList.length
            wsList.push(ws)
            
            /** 链接成功发送一条消息 */
            ws.send(ServiceWs.codeSendClientData({port, id: linkNum}, WS_CODE.JOIN_ID))
        })
        
        /** 发送心跳包 */
        const IntervalHandle = () => {
            clearTimeout(this.setIntervalIndex)
            wss.clients.forEach(function (ws) {
                if (Reflect.get(ws, 'isAlive').isAlive === false) { return ws.terminate() }
                Reflect.set(ws, 'isAlive', false )
                ws.ping()
            })
            this.setIntervalIndex = setTimeout(IntervalHandle, 30000)
        }
        IntervalHandle()

        /** 服务关闭时 */
        wss.on('close',  () =>{
            clearTimeout(this.setIntervalIndex)
        })
    }

    private onMeassage(ws: WebSocket) {
        ws.onmessage = function(data) {
            try {
                const codeData = JSON.parse(data as unknown as string)
                if (codeData.target === undefined) { throw new Error('target不能为空') }
            } catch(error) {
                ws.send(ServiceWs.codeSendClientData({msg: error.message}, WS_CODE.ERROR))
            }
        }
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