import { ParamExceotion } from "../exceptions"
import { interfaceRoom } from "../interface/interfaceRoom"
import { ServiceRoom } from "./ServiceRoom"
import { ServiceWs } from "./ServiceWs"

const roomMap = new Map()
export class ServicePlayRoom{

    public room: interfaceRoom.detailForm<any>

    private liIndex: number| null = null
    private itemIndex: number | null = null
    private playLink: string | null = null

    public playWs: ServiceWs
    public chatWs: ServiceWs

    constructor(room: interfaceRoom.detailForm<any>, playWs: ServiceWs, chatWs: ServiceWs) {
        this.room = room
        this.playWs = playWs
        this.chatWs = chatWs
    }

    static async of(roomID: number, masterID: number): Promise<ServicePlayRoom>{
        if (roomMap.has(roomID)) { return roomMap.get(roomID) }
        const playWs = new ServiceWs()
        const chatWs = new ServiceWs()
        const room = await ServiceRoom.get(roomID, masterID)
        const playRoom = new ServicePlayRoom(room, playWs, chatWs)
        roomMap.set(room.id, playRoom)
        return playRoom
    }

    public getCurrent(addrss: string): interfaceRoom.wsStatuProp {
        const {liIndex, itemIndex, playLink} = this
        const playWs = addrss + this?.playWs?.port
        const chatWs = addrss + this?.chatWs?.port
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