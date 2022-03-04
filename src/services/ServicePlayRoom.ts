import config from "../config"
import { ParamExceotion } from "../exceptions"
import { interfaceRoom } from "../interface/interfaceRoom"
import { WS_CODE } from "../menu/WS_CODE"
import { decodeVideoDuration } from "../utils/decodeVideoDuration"
import { date } from "../utils/utils"
import { ServiceACGTV } from "./ServiceACGTV"
import  ServiceLog  from "./ServiceLog"
import { ServiceRoom } from "./ServiceRoom"
import { ServiceUser } from "./ServiceUser"
import { ServiceWs } from "./ServiceWs"

const roomMap = new Map()
export class ServicePlayRoom{

    public room: interfaceRoom.detailForm<any>

    private liIndex: number| null = null
    private itemIndex: number | null = null
    private playLink: string | null = null
    private playStart: Date
    private playDuration: number
    private users: Set<ServiceUser> = new Set()

    private unifiedTimeIndex // 向用户广播视频进度的定时器

    public playWs: ServiceWs
    public chatWs: ServiceWs

    constructor(room: interfaceRoom.detailForm<any>, playWs: ServiceWs, chatWs: ServiceWs) {
        this.room = room
        this.playWs = playWs
        this.chatWs = chatWs
    }

    /**
     * 加入到房间
     */
    public join(user: ServiceUser) {
        this.users.add(user)
        const msg = `${user.udata.nickname} 进入房间`
        this.chatWs.notify({msg}, WS_CODE.USER_JOIN)
    }
    
    /**
     * 退出房间
     */
    public out(user: ServiceUser) {
        this.users.delete(user)
        const msg = `${user.udata.nickname} 退出房间`
        this.chatWs.notify({msg}, WS_CODE.USER_OUT)
    }

    /**
     * 清空销毁房间
     */
    public clear() {
        clearTimeout(this.unifiedTimeIndex)
        this.users.forEach(user => {
            user.playRoom = null
        })
        this.users = new Set()
        roomMap.delete(this.room.id)
    }


    /**
     * 根据房间id和用户id来对应一个单例实例
     * @param roomID 
     * @param masterID 
     * @returns 
     * ```
     * const roomID = 1
     * const masterID = 1
     * const playRoom1 = ServicePlayRoom.of(roomID, masterID)
     * const playRoom2 = ServicePlayRoom.of(roomID, masterID)
     * console.log(playRoom1 === playRoom2) // true
     * ```
     */
    static async of(roomID: number, masterID: number): Promise<ServicePlayRoom>{
        if (roomMap.has(roomID)) { return roomMap.get(roomID) }
        const playWs = new ServiceWs()
        const chatWs = new ServiceWs()
        const room = await ServiceRoom.get(roomID, masterID)
        const playRoom = new ServicePlayRoom(room, playWs, chatWs)
        roomMap.set(room.id, playRoom)
        return playRoom
    }

    /**
     * 返回当前房间的 websocker
     * @param addrss {strinig} ws服务根地址
     * @returns url字符串
     * ```
     * const roomID = 1
     * const masterID = 1
     * const playRoom = ServicePlayRoom.of(roomID, masterID)
     * console.log(playRoom.getCurrent('ws://127.0.0.1')) // ws://127.0.0.1:3002
     * ```
     */
    public getCurrent(addrss: string): interfaceRoom.wsStatuProp {
        const {liIndex, itemIndex, playLink} = this
        const playWs = addrss + this?.playWs?.port
        const chatWs = addrss + this?.chatWs?.port
        const currentDate = new Date().getTime()
        const startDate = this.playStart ? this.playStart.getTime() : 0
        return {liIndex, itemIndex, playLink, currentDate, startDate, playWs, chatWs}
    }
    
    /**
     * 设置当前房间的播放地址
     * @param liIndex {number} 当前房间列表的下标索引
     * @param itemIndex {number} 当前房间列表内的项目下标索引
     */
    public async setPlayIndex(liIndex: number, itemIndex: number): Promise<void> {
        const room = this.room
        if (liIndex > room.from_data.list.length) { throw new ParamExceotion('list索引超出边界') }
        const item = room.from_data.list[liIndex]
        if (itemIndex > item.li.length) { throw new ParamExceotion('item索引超出边界') }
        
        // 解码播放链接
        const encodeLink = item.li[itemIndex].href
        const playLink = await ServiceACGTV.getPlayLinkByUrl(encodeLink)
        const playDuration = await decodeVideoDuration(playLink)
        const playStart = new Date()

        // 重置新的播放链接
        this.playLink = playLink
        this.playStart = playStart
        this.playDuration = playDuration
        this.liIndex = liIndex
        this.itemIndex = itemIndex
        const data = { liIndex, itemIndex, playLink, playStart }
        // 立即广播，切换音频
        this.playWs.notify(data, WS_CODE.SWITCH_PLAY)
        // 间隔广播当前进度
        this.unifiedTime()
    }

    /**
     * 广播当前的播放进度
     */
    private async unifiedTime() {
        clearTimeout(this.unifiedTimeIndex)
        const currnet = new Date()
        const diffTime = this.playDuration - (currnet.getTime() - this.playStart.getTime())
        
        if (diffTime < config.playVideoSleep / 1500) { return setTimeout(() => this.nextPlay(), diffTime + config.playVideoSleep) }
        this.unifiedTimeIndex = setTimeout(() => {
            try {
                this.playWs.notify({
                    currnet: currnet.getTime(),
                    start: this.playStart.getTime()
                }, WS_CODE.UNIFIED_PLAY)
                this.unifiedTime()
            } catch(e) {}
        }, config.playVideoSleep);
    }

    /** 播放下一个 */
    private async nextPlay() {
        try {
            const li = this.room.from_data.list[this.liIndex].li
            const nextItem = this.itemIndex + 1
            if (nextItem >= li.length) {
                this.playWs.notify({
                    msg: '播放已结束，房间即将销毁'
                }, WS_CODE.MSG)
                this.clear()
                await ServiceRoom.deleteByID(this.room.id) 
            } else{
                this.playWs.notify({
                    msg: '即将播放下一个视频'
                }, WS_CODE.MSG)
                await this.setPlayIndex(this.liIndex, nextItem)
            }
        } catch(e) {
            ServiceLog.writeToDay(e, '静默切换视频执行异常')
        }
    }
}