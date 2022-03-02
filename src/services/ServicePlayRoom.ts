import { ParamExceotion } from "../exceptions"
import { interfaceRoom } from "../interface/interfaceRoom"
import { ServiceRoom } from "./ServiceRoom"
import { ServiceWs } from "./ServiceWx"

const roomMap = new Map()
export class ServicePlayRoom{

    private room: interfaceRoom.detailForm<any>

    private liIndex: number| null = null
    private itemIndex: number | null = null
    private playLink: string | null = null

    public playWs: ServiceWs
    public chatWs: ServiceWs

    constructor(room: interfaceRoom.detailForm<any>) {
        this.room = room
        this.playWs = new ServiceWs()
        this.chatWs = new ServiceWs()
    }

    static async of(roomID: number, master_id: number): Promise<ServicePlayRoom>{
        if (roomMap.has(roomID)) { return roomMap.get(roomID) }
        console.log('开始')
        const room = await ServiceRoom.get(roomID, master_id)
        console.log('卡住了？')
        const playRoom = new ServicePlayRoom(room)
        roomMap.set(roomID, playRoom)
        return playRoom
    }

    public getCurrent(addrss: string): interfaceRoom.wsStatuProp {
        const {liIndex, itemIndex, playLink} = this
        const playWs = addrss + this.playWs.port
        const chatWs = addrss + this.chatWs.port
        return {liIndex, itemIndex, playLink, playWs, chatWs}
    }
    
    public setPlayIndex(liIndex: number, itemIndex: number, playLink: string): void {
        const room = this.room
        if (liIndex > room.from_data.list.length) {
            throw new ParamExceotion('list索引超出边界')
        }
        const li = room.from_data.list[liIndex]
        if (itemIndex > li.length) {
            throw new ParamExceotion('item索引超出边界')
        }
        this.liIndex = liIndex
        this.itemIndex = itemIndex
        const data = {
            liIndex, itemIndex, playLink
        }
        this.playWs.notify(data)
    }
}